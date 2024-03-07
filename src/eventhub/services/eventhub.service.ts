// src/eventhub/services/eventhub.service.ts
import { Injectable } from '@nestjs/common';
import { EventHubConsumerClient, ReceivedEventData } from '@azure/event-hubs';
import { ServiceBusService } from 'src/servicebus/services/servicebus.service';

// @Injectable()
// export class EventHubService {
//   private eventHubClient: EventHubConsumerClient;

//   constructor(connectionString: string, eventHubName: string, consumerGroup: string) {
//     // Initialize the Event Hub client with connection string, event hub name, and consumer group
//     this.eventHubClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
//   }

//   async startListening() {
//     // Subscribe to events from the Event Hub
//     this.eventHubClient.subscribe({
//       processEvents: async (events: ReceivedEventData[]) => {
//         for (const event of events) {
//           console.log('Received event: ', event.body);
//           // Process the received event as needed
//         }
//       },
//       processError: async (err) => {
//         console.error('Error occurred while receiving events: ', err);
//       }
//     });
//   }

//   async stopListening() {
//     // Close the Event Hub client
//     await this.eventHubClient.close();
//   }

//   private processEvent(event: ReceivedEventData) {
//     // Process the received event as needed
//     // ...

//     // Example: Send the event data to a Service Bus queue based on message category
//     if (event.category === 'category1') {
//       this.sendToQueue1(event);
//     } else if (event.category === 'category2') {
//       this.sendToQueue2(event);
//     }
//     // Add more conditions as needed for other message categories
//   }

//   private sendToQueue1(event: ReceivedEventData) {
//     // Send the event data to Service Bus Queue 1
//     this.serviceBusService.sendMessageToQueue1(event);
//   }

//   private sendToQueue2(event: ReceivedEventData) {
//     // Send the event data to Service Bus Queue 2
//     this.serviceBusService.sendMessageToQueue2(event);
//   }
// }



@Injectable()
export class EventHubService {
  private eventHubClient: EventHubConsumerClient;

  constructor(
    private readonly serviceBusService: ServiceBusService, // Inject ServiceBusService
    private readonly connectionString: string, // Connection string for the Event Hub
    private readonly eventHubName: string // Name of the Event Hub
  ) {
    // Initialize the Event Hub client
    this.eventHubClient = new EventHubConsumerClient('$Default', connectionString, eventHubName);
  }

  async startListening() {
    // Subscribe to events from the Event Hub
     await this.eventHubClient.subscribe({
      processEvents: async (events: ReceivedEventData[]) => {
        for (const event of events) {
          // Process each received event
          this.processEvent(event);
        }
      },
      processError: async (err) => {
        console.error('Error occurred while receiving events: ', err);
      }
    });
  }

  async stopListening() {
    // Close the Event Hub client
    await this.eventHubClient.close();
  }

  private processEvent(event: ReceivedEventData) {
    // Implement event processing logic here
    console.log('Received event: ', event.body);

    // Determine the queue name based on event content or any other criteria
    const queueName = this.getQueueNameFromEvent(event);

    // Send the event data to the corresponding Service Bus queue
    if (queueName) {
      this.serviceBusService.sendMessageToQueue(event.body, queueName);
    } else {
      console.warn('No queue found for event: ', event.body);
    }
  }

  private getQueueNameFromEvent(event: ReceivedEventData): string | null {
    
    // Extract queue name from event properties
    const queueName = event.properties && event.properties.queueName;
    return queueName || null;
  }

  // private getCategoryFromEvent(event: ReceivedEventData): string {
  //   // Implement logic to determine the category of the event
  //   // For example, parse event data and extract category information
  //   // For illustration purposes, let's assume category is determined based on event properties
  //   return event.properties.category || 'defaultCategory';
  // }

  // private sendToQueue1(event: ReceivedEventData) {
  //   // Send the event data to Service Bus Queue 1
  //   this.serviceBusService.sendMessageToQueue1(event);
  // }

  // private sendToQueue2(event: ReceivedEventData) {
  //   // Send the event data to Service Bus Queue 2
  //   this.serviceBusService.sendMessageToQueue2(event);
  // }
  // // Implement methods to send messages to different Service Bus queues here
}
