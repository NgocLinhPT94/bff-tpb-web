import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';

/**
 * Promotion product summary DTO for Swagger documentation.
 */
export class PromotionProductSummarySwaggerDto {
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
export class PromotionSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'promo-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Promotion title',
    example: 'New Year Cashback Promotion',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'new-year-cashback',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'Get up to 5% cashback on all transactions this January.',
  })
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Promotion content as structured blocks',
    example: [{ type: 'paragraph', content: 'Terms and conditions...' }],
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
    example: 'Apply Now',
  })
  ctaLabel?: string;

  @ApiPropertyOptional({
    description: 'Call-to-action link URL',
    example: '/products/digital-savings-account',
  })
  ctaLink?: string;

  @ApiPropertyOptional({
    description: 'Customer segment',
    enum: ['individual', 'corporate', 'priority', 'all'],
    example: 'all',
  })
  customerSegment?: string;

  @ApiPropertyOptional({
    description: 'Applicable cards',
    enum: ['Visa', 'Mastercard', 'JCB'],
    example: 'Visa',
  })
  applicableCards?: string;

  @ApiPropertyOptional({
    description: 'Target audience',
    enum: ['Cá nhân', 'Doanh nghiệp', 'Tất cả'],
    example: 'Tất cả',
  })
  targetAudience?: string;

  @ApiProperty({
    description: 'Promotion banner images',
    type: [MediaSummarySwaggerDto],
  })
  banner!: MediaSummarySwaggerDto[];

  @ApiProperty({
    description: 'Related products',
    type: [PromotionProductSummarySwaggerDto],
  })
  products!: PromotionProductSummarySwaggerDto[];
}
