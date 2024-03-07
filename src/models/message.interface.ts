// Define a TypeScript interface representing the message schema
export interface Message {
    _id?: string; 
    messageId: string;
    body: any;
    timestamp: Date;
  }
  