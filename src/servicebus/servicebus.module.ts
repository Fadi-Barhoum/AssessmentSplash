// src/servicebus/servicebus.module.ts
import { Module } from '@nestjs/common';
import { ServiceBusService } from './services/servicebus.service';

@Module({
  providers: [ServiceBusService],
  exports: [ServiceBusService],
})
export class ServiceBusModule {}
