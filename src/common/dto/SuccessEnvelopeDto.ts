import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RequestMetaDto } from './RequestMetaDto';

/**
 * Success response envelope wrapper.
 * All successful API responses use this structure.
 *
 * @template T The type of the data payload
 *
 * @example
 * ```json
 * {
 *   "data": { "id": 1, "title": "Hello World" },
 *   "meta": {
 *     "requestId": "550e8400-e29b-41d4-a716-446655440000"
 *   }
 * }
 * ```
 */
export class SuccessEnvelopeDto<T> {
  /**
   * Response payload data.
   * The actual resource or collection of resources.
   */
  @ApiProperty({
    description:
      'Response payload data - the actual resource or collection of resources',
    type: Object,
  })
  data: T;

  /**
   * Response metadata including requestId and optional pagination.
   */
  @ApiProperty({
    description:
      'Response metadata including requestId and optional pagination',
    type: RequestMetaDto,
  })
  @ValidateNested()
  @Type(() => RequestMetaDto)
  meta: RequestMetaDto;

  constructor(data: T, meta: RequestMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
