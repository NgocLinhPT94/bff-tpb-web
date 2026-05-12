import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Pagination information included in response metadata.
 */
export class PaginationMeta {
  /** Current page number (1-indexed) */
  @ApiProperty({
    description: 'Current page number (1-indexed)',
    example: 1,
    type: Number,
  })
  @IsNumber()
  page!: number;

  /** Number of items per page */
  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    type: Number,
  })
  @IsNumber()
  pageSize!: number;

  /** Total number of pages */
  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
    type: Number,
  })
  @IsNumber()
  pageCount!: number;

  /** Total number of items across all pages */
  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
    type: Number,
  })
  @IsNumber()
  total!: number;
}

/**
 * Metadata included in all API responses.
 */
export class RequestMetaDto {
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

  /**
   * Pagination information for list responses.
   * Omitted for single resource responses.
   */
  @ApiPropertyOptional({
    description:
      'Pagination information for list responses (omitted for single resource responses)',
    type: PaginationMeta,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationMeta)
  pagination?: PaginationMeta;
}
