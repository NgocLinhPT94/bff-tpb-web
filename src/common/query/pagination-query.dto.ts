import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Pagination query parameters for list endpoints.
 *
 * @example
 * // URL: ?page=2&pageSize=25
 */
export class PaginationQueryDto {
  /**
   * Page number (1-indexed).
   * @default 1
   */
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    minimum: 1,
    default: 1,
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  @Type(() => Number)
  page: number = 1;

  /**
   * Number of items per page.
   * Must be between 1 and 50.
   * @default 20
   */
  @ApiPropertyOptional({
    description: 'Number of items per page (max 50)',
    minimum: 1,
    maximum: 50,
    default: 20,
    example: 20,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'pageSize must be an integer' })
  @Min(1, { message: 'pageSize must be at least 1' })
  @Max(50, { message: 'pageSize must not exceed 50' })
  @Type(() => Number)
  pageSize: number = 20;
}
