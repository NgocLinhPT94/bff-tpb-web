import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';
import { CategorySwaggerDto } from '../categories/categories.swagger.dto.js';

/**
 * FAQ product summary DTO for Swagger documentation.
 */
export class FaqProductSummarySwaggerDto {
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
    example: 'saving',
  })
  product_type?: string;

  @ApiPropertyOptional({
    description: 'Short description of the product',
    example: 'A high-yield savings account with no minimum balance.',
  })
  short_description?: string;

  @ApiPropertyOptional({
    description: 'Product thumbnail image',
    type: MediaSummarySwaggerDto,
  })
  thumbnail?: MediaSummarySwaggerDto | null;
}

/**
 * FAQ DTO for Swagger documentation.
 */
export class FaqSwaggerDto {
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

  @ApiPropertyOptional({
    description: 'FAQ answer as structured blocks',
    example: [{ type: 'paragraph', content: 'To open a savings account...' }],
  })
  answer?: unknown[];

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'how-to-open-savings-account',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Whether the FAQ is active',
    example: true,
  })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'FAQ category',
    type: CategorySwaggerDto,
  })
  category?: CategorySwaggerDto | null;

  @ApiPropertyOptional({
    description: 'Related product',
    type: FaqProductSummarySwaggerDto,
  })
  product?: FaqProductSummarySwaggerDto | null;
}
