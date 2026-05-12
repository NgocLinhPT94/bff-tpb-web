import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummaryDto } from '../../common/swagger/common.swagger.dto';

/**
 * Product FAQ summary DTO for Swagger documentation.
 */
export class ProductFaqSummaryDto {
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
export class ProductPromotionSummaryDto {
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
export class ProductDto {
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
    type: MediaSummaryDto,
  })
  thumbnail?: MediaSummaryDto;

  @ApiPropertyOptional({
    description: 'Main banner image',
    type: MediaSummaryDto,
  })
  mainBanner?: MediaSummaryDto;

  @ApiProperty({
    description: 'Product documents and brochures',
    type: [MediaSummaryDto],
  })
  documents!: MediaSummaryDto[];

  @ApiProperty({
    description: 'Related FAQs',
    type: [ProductFaqSummaryDto],
  })
  faqs!: ProductFaqSummaryDto[];

  @ApiProperty({
    description: 'Active promotions',
    type: [ProductPromotionSummaryDto],
  })
  promotions!: ProductPromotionSummaryDto[];
}
