import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MediaSummarySwaggerDto,
  RelationSummarySwaggerDto,
} from '../../common/swagger/common.swagger.dto.js';

/**
 * Product category DTO for Swagger documentation.
 */
export class ProductCategorySwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'prodcat-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Savings Products',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'savings-products',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'All savings and deposit products offered by TPBank.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Category icon',
    type: MediaSummarySwaggerDto,
  })
  icon?: MediaSummarySwaggerDto;

  @ApiProperty({
    description: 'Banner images',
    type: [MediaSummarySwaggerDto],
  })
  bannerImage!: MediaSummarySwaggerDto[];

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 1,
  })
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
    example: true,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'SEO metadata',
    example: { metaTitle: '...', metaDescription: '...' },
  })
  seo?: unknown;

  @ApiPropertyOptional({
    description: 'Published date (ISO 8601)',
    example: '2024-01-15T00:00:00.000Z',
  })
  publishedDate?: string;

  @ApiProperty({
    description: 'Related products',
    type: [RelationSummarySwaggerDto],
  })
  products!: RelationSummarySwaggerDto[];

  @ApiProperty({
    description: 'Related promotions',
    type: [RelationSummarySwaggerDto],
  })
  promotions!: RelationSummarySwaggerDto[];
}
