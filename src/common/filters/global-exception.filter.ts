import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { randomUUID } from 'crypto';
import { ErrorEnvelopeDto } from '../dto';
import type { RequestWithId } from '../http/request-with-id';

const statusCodeMap: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
  [HttpStatus.REQUEST_TIMEOUT]: 'REQUEST_TIMEOUT',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
  [HttpStatus.GATEWAY_TIMEOUT]: 'GATEWAY_TIMEOUT',
};

const statusMessageMap: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Bad request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not found',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method not allowed',
  [HttpStatus.REQUEST_TIMEOUT]: 'Request timeout',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests',
  [HttpStatus.BAD_GATEWAY]: 'Upstream service error',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Upstream service unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Upstream service timeout',
};

/**
 * Global exception filter that catches all unhandled exceptions
 * and returns a standardized error envelope response.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();
    const status = this.getStatus(exception);
    const requestId = request.requestId ?? randomUUID();

    response
      .status(status)
      .json(
        new ErrorEnvelopeDto(
          this.getCode(status),
          this.getMessage(status),
          requestId,
        ),
      );
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getCode(status: number): string {
    return statusCodeMap[status] ?? 'INTERNAL_ERROR';
  }

  private getMessage(status: number): string {
    return statusMessageMap[status] ?? 'Internal server error';
  }
}
