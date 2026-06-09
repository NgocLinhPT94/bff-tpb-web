import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Error details included in error responses.
 */
export class ErrorDetailsDto {
  /**
   * Machine-readable error code.
   * Examples: BAD_REQUEST, NOT_FOUND, INTERNAL_ERROR
   */
  @ApiProperty({
    description: 'Machine-readable error code',
    examples: [
      'BAD_REQUEST',
      'NOT_FOUND',
      'INTERNAL_ERROR',
      'METHOD_NOT_ALLOWED',
      'TOO_MANY_REQUESTS',
      'BAD_GATEWAY',
    ],
    type: String,
  })
  @IsString()
  code!: string;

  /**
   * Human-readable error message.
   * Provides context about what went wrong.
   */
  @ApiProperty({
    description: 'Human-readable error message',
    example: 'Resource not found',
    type: String,
  })
  @IsString()
  message!: string;

  /**
   * Unique request identifier (UUID v4).
   * Used for tracing and debugging.
   */
  @ApiProperty({
    description: 'Unique request identifier (UUID v4) for tracing',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
  })
  @IsString()
  requestId!: string;
}

/**
 * Error response envelope wrapper.
 * All error API responses use this structure.
 *
 * @example
 * ```json
 * {
 *   "error": {
 *     "code": "NOT_FOUND",
 *     "message": "Article with slug 'hello-world' not found",
 *     "requestId": "550e8400-e29b-41d4-a716-446655440000"
 *   }
 * }
 * ```
 */
export class ErrorEnvelopeDto {
  /**
   * Error details including code, message, and requestId.
   */
  @ApiProperty({
    description: 'Error details including code, message, and requestId',
    type: ErrorDetailsDto,
  })
  @ValidateNested()
  @Type(() => ErrorDetailsDto)
  error: ErrorDetailsDto;

  constructor(code: string, message: string, requestId: string) {
    this.error = {
      code,
      message,
      requestId,
    };
  }
}
