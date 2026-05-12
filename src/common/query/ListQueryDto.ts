import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from './PaginationQueryDto';
import { SortOption, SortQueryDto } from './SortQueryDto';

/**
 * Combined query DTO for collection list endpoints.
 * Includes pagination and sort parameters.
 *
 * @example
 * // URL: ?page=2&pageSize=25&sort=createdAt:desc
 * const query = new ListQueryDto();
 * query.page = 2;
 * query.pageSize = 25;
 * query.sort = SortOption.CREATED_AT_DESC;
 */
export class ListQueryDto extends PaginationQueryDto implements SortQueryDto {
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
