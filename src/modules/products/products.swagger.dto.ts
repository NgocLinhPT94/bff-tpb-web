import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';

/**
 * Product FAQ summary DTO for Swagger documentation.
 */
export class ProductFaqSummarySwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'faq-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'FAQ question',
    example: 'How do I open a savings account?',
  })
  question?: string;
}

/**
 * Product promotion summary DTO for Swagger documentation.
 */
export class ProductPromotionSummarySwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'promo-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Promotion title',
    example: 'New Year Special Offer',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'new-year-special',
  })
  slug?: string;
}

/**
 * Product DTO for Swagger documentation.
 */
export class ProductSwaggerDto {
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

  @ApiPropertyOptional({
    description: 'Product type',
    enum: ['account', 'credit_card', 'loan', 'saving', 'insurance'],
    example: 'saving',
  })
  productType?: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'A high-yield savings account with no minimum balance.',
  })
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail image',
    type: MediaSummarySwaggerDto,
  })
  thumbnail?: MediaSummarySwaggerDto;

  @ApiPropertyOptional({
    description: 'Main banner image',
    type: MediaSummarySwaggerDto,
  })
  mainBanner?: MediaSummarySwaggerDto;

  @ApiProperty({
    description: 'Product documents and brochures',
    type: [MediaSummarySwaggerDto],
  })
  documents!: MediaSummarySwaggerDto[];

  @ApiProperty({
    description: 'Related FAQs',
    type: [ProductFaqSummarySwaggerDto],
  })
  faqs!: ProductFaqSummarySwaggerDto[];

  @ApiProperty({
    description: 'Active promotions',
    type: [ProductPromotionSummarySwaggerDto],
  })
  promotions!: ProductPromotionSummarySwaggerDto[];
}
