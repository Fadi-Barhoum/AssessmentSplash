import { Module } from '@nestjs/common';
import { EventHubService } from './services/eventhub.service';

@Module({
  providers: [EventHubService],
  exports: [EventHubService],
})
export class EventHubModule {}
