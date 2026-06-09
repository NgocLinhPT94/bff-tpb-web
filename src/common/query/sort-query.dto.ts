import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Available sort options for collection list endpoints.
 */
export enum SortOption {
  PUBLISHED_AT_DESC = 'publishedAt:desc',
  PUBLISHED_AT_ASC = 'publishedAt:asc',
  CREATED_AT_DESC = 'createdAt:desc',
  CREATED_AT_ASC = 'createdAt:asc',
  UPDATED_AT_DESC = 'updatedAt:desc',
  UPDATED_AT_ASC = 'updatedAt:asc',
}

/**
 * Sort query parameter for list endpoints.
 *
 * @example
 * // URL: ?sort=publishedAt:desc
 */
export class SortQueryDto {
  @ApiPropertyOptional({
    description: 'Sort order for the results',
    enum: SortOption,
    default: SortOption.PUBLISHED_AT_DESC,
    example: SortOption.PUBLISHED_AT_DESC,
  })
  @IsOptional()
  @IsEnum(SortOption, {
    message: `sort must be one of: ${Object.values(SortOption).join(', ')}`,
  })
  sort: SortOption = SortOption.PUBLISHED_AT_DESC;
}
