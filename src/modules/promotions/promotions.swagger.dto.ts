import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummaryDto } from '../../common/swagger/common.swagger.dto';

/**
 * Promotion product summary DTO for Swagger documentation.
 */
export class PromotionProductSummaryDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'product-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Digital Savings Account',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'digital-savings-account',
  })
  slug?: string;
}

/**
 * Promotion DTO for Swagger documentation.
 */
export class PromotionDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'promo-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Promotion title',
    example: 'New Year Special Offer 2024',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'new-year-special-2024',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'Get 50% off on account opening fees.',
  })
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Promotion content as structured blocks',
    example: [{ type: 'paragraph', content: 'Welcome to...' }],
  })
  content?: unknown[];

  @ApiPropertyOptional({
    description: 'Promotion start date (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Promotion end date (ISO 8601)',
    example: '2024-01-31T23:59:59.000Z',
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Call-to-action button label',
    example: 'Learn More',
  })
  ctaLabel?: string;

  @ApiPropertyOptional({
    description: 'Call-to-action link URL',
    example: '/promotions/new-year-special',
  })
  ctaLink?: string;

  @ApiProperty({
    description: 'Promotion banner images',
    type: [MediaSummaryDto],
  })
  banner!: MediaSummaryDto[];

  @ApiProperty({
    description: 'Products associated with this promotion',
    type: [PromotionProductSummaryDto],
  })
  products!: PromotionProductSummaryDto[];
}
