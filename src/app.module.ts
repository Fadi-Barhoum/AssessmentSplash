import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EventHubModule } from './eventhub/eventhub.module';
import { ServiceBusModule } from './servicebus/servicebus.module';
import { ListenService } from './listen-service/listen-service.service';
import { GlobalExceptionsFilter } from './global-exceptions.filter'; 
import { APP_FILTER } from '@nestjs/core'; 
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './error.interceptor';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/assesDB'),
    AuthModule,
    EventHubModule,
    ServiceBusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ListenService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
