// error interceptor to intercept and handle errors globally before sending responses to clients

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
    HttpException, 
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  
  @Injectable()
  export class ErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError(error => {
          const status =
            error instanceof HttpException 
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
  
          return throwError({
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: error.message || 'Internal server error',
          });
        }),
      );
    }
  }
  