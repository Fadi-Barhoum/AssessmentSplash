import { Injectable } from '@nestjs/common';
import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { ServiceBusService } from 'src/servicebus/services/servicebus.service';

@Injectable()
export class EventHubService {
  private eventHubClient: EventHubConsumerClient;

  constructor(
    private readonly serviceBusService: ServiceBusService, 
    private readonly connectionString: string,
    private readonly eventHubName: string 
  ) {
    this.eventHubClient = new EventHubConsumerClient('$Default', connectionString, eventHubName);
  }

  async startListening() {
     await this.eventHubClient.subscribe({
      processEvents: async (events: ReceivedEventData[]) => {
        for (const event of events) {
          this.processEvent(event);
        }
      },
      processError: async (err) => {
        console.error('Error occurred while receiving events: ', err);
      }
    });
  }

  async stopListening() {
    await this.eventHubClient.close();
  }

  private processEvent(event: ReceivedEventData) {
    console.log('Received event: ', event.body);
    const queueName = this.getQueueNameFromEvent(event);
    if (queueName) {
      this.serviceBusService.sendMessageToQueue(event.body, queueName);
    } else {
      console.warn('No queue found for event: ', event.body);
    }
  }

  private getQueueNameFromEvent(event: ReceivedEventData): string | null {
    const queueName = event.properties && event.properties.queueName;
    return queueName || null;
  }
}
