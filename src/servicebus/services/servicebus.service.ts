import { Injectable } from '@nestjs/common';
import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { MongoClient } from 'mongodb';
import { Message } from 'src/models/message.interface';

@Injectable()
export class ServiceBusService {
  private serviceBusClient: ServiceBusClient;
  private mongoClient: MongoClient;

  constructor(connectionString: string, mongoConnectionString: string) {
    this.serviceBusClient = new ServiceBusClient(connectionString);
    this.mongoClient = new MongoClient(mongoConnectionString);
    this.mongoClient.connect().then(() => console.log('Connected to MongoDB'));
  }

  async sendMessageToQueue(messageBody: any, queueName: string) {
    const sender = this.serviceBusClient.createSender(queueName);

    try {
      // Create a message to send
      const message: ServiceBusMessage = {
        body: messageBody,
      };

      // Send the message to the queue
      await sender.sendMessages(message);
      console.log('Message sent to queue:', queueName);
    } catch (error) {
      console.error('Error sending message to queue:', queueName, error);

      // Retry sending the message after a delay
      const delayMs = 5000; // 5 seconds delay (adjust as needed)
      setTimeout(async () => {
        console.log(`Retrying message sending to queue '${queueName}' after ${delayMs} milliseconds...`);
        await this.sendMessageToQueue(messageBody, queueName);
      }, delayMs);
    } finally {
      // Close the sender to release resources
      await sender.close();
    }
  }

  async receiveMessagesFromQueue(queueName: string, processMessage: (message: any) => Promise<void>) {
    const receiver = this.serviceBusClient.createReceiver(queueName);

    receiver.subscribe({
      processMessage: async (message) => {
        try {
          await processMessage(message.body);
          await receiver.completeMessage(message);
        } catch (error) {
          console.error('Error processing message from queue:', queueName, error);
          await receiver.abandonMessage(message);
        }
      },
      processError: async (error) => {
        console.error('Error occurred while receiving messages from queue:', queueName, error);
      }
    });
  }

  async storeMessageInMongoDB(message: Message, collectionName: string) {
    try {
      // Extract necessary fields from the incoming message
      const messageId = message.messageId; // Assuming the message has a 'messageId' field
      const payload = message.body; // Assuming the message body is stored in the 'body' field
  
      // Perform data transformation or preprocessing if needed
      const transformedMessage: Message = {
        messageId: messageId,
        body: payload,
        timestamp: new Date(),
      };
  
      // Insert the transformed message into MongoDB
      const db = this.mongoClient.db();
      const collection = db.collection<Message>(collectionName);
      await collection.insertOne(transformedMessage);
      console.log('Message stored in MongoDB:', transformedMessage);
    } catch (error) {
      console.error('Error storing message in MongoDB:', error);
    }
  }
  
  
}
