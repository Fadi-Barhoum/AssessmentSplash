import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ListenService } from './listen-service/listen-service.service'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const listenService = app.get(ListenService); 
  await listenService.startEventHubListener(); 
  await app.listen(3000);
}
bootstrap();

async function shutdown() {
  const app = await NestFactory.create(AppModule);
  const listenService = app.get(ListenService); 
  await listenService.stopEventHubListener(); 
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
