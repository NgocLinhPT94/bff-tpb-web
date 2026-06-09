import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RelationSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';

/**
 * Navigation item DTO for Swagger documentation.
 */
export class NavigationItemSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'nav-item-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Navigation item name',
    example: 'personal-banking',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Display title',
    example: 'Personal Banking',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Navigation URL',
    example: '/personal-banking',
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
  icon?: object;

  @ApiProperty({
    description: 'Parent navigations this item belongs to',
    type: [RelationSummarySwaggerDto],
  })
  navigations!: RelationSummarySwaggerDto[];

  @ApiPropertyOptional({
    description: 'Parent navigation item',
    type: RelationSummarySwaggerDto,
  })
  parent?: RelationSummarySwaggerDto;

  @ApiProperty({
    description: 'Child navigation items (self-referencing)',
    type: () => [NavigationItemSwaggerDto],
  })
  children!: NavigationItemSwaggerDto[];
}
