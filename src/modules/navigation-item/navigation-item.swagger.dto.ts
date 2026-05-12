import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RelationSummaryDto } from '../../common/swagger/common.swagger.dto';

/**
 * Navigation item DTO for Swagger documentation.
 * Includes parent and children relationships for tree structure.
 */
export class NavigationItemDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'nav-item-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Navigation item name',
    example: 'Products',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Navigation item title',
    example: 'Our Products',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Navigation URL',
    example: '/products',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  order?: number;

  @ApiPropertyOptional({
    description: 'Navigation item icon',
    type: Object,
  })
  icon?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Parent navigation reference',
    type: RelationSummaryDto,
  })
  navigation?: RelationSummaryDto;

  @ApiPropertyOptional({
    description: 'Parent navigation item reference',
    type: RelationSummaryDto,
  })
  parent?: RelationSummaryDto;

  @ApiProperty({
    description: 'Child navigation items (tree structure)',
    type: () => [NavigationItemDto],
  })
  children!: NavigationItemDto[];
}
