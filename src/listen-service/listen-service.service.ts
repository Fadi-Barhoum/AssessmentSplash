// src/some-service/some-service.service.ts
import { Injectable } from '@nestjs/common';
import { EventHubService } from '../eventhub/services/eventhub.service';

@Injectable()
export class ListenService {
  constructor(private readonly eventHubService: EventHubService) {}

  async startEventHubListener() {
    await this.eventHubService.startListening();
  }

  async stopEventHubListener() {
    await this.eventHubService.stopListening();
  }
}
