import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Observable, tap } from 'rxjs';
import type { RequestWithId } from '../http/request-with-id';

/**
 * Interceptor that logs request method, path, status code, duration, and requestId.
 * Uses PinoLogger for structured JSON logging.
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(RequestLoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithId>();
    const response = http.getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.info({
          method: request.method,
          path: request.originalUrl,
          status: response.statusCode,
          duration: Date.now() - startedAt,
          requestId: request.requestId,
        });
      }),
    );
  }
}
