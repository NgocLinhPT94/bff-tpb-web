import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummaryDto } from '../../common/swagger/common.swagger.dto';
import { CategoryDto } from '../categories/categories.swagger.dto';

/**
 * FAQ product summary DTO for Swagger documentation.
 */
export class FaqProductSummaryDto {
  @ApiPropertyOptional({
    description: 'Unique document identifier',
    example: 'product-001',
  })
  documentId?: string;

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
    description: 'Short description',
    example: 'A high-yield savings account.',
  })
  short_description?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail image',
    type: MediaSummaryDto,
  })
  thumbnail?: MediaSummaryDto | null;
}

/**
 * FAQ DTO for Swagger documentation.
 */
export class FaqDto {
  @ApiPropertyOptional({
    description: 'Unique document identifier',
    example: 'faq-001',
  })
  documentId?: string;

  @ApiPropertyOptional({
    description: 'FAQ question',
    example: 'How do I open a savings account?',
  })
  question?: string;

  @ApiPropertyOptional({
    description: 'FAQ answer as structured blocks',
    example: [{ type: 'paragraph', content: 'To open an account...' }],
  })
  answer?: unknown[];

  @ApiPropertyOptional({
    description: 'Whether the FAQ is active',
    example: true,
  })
  active?: boolean;

  @ApiPropertyOptional({
    description: 'FAQ category',
    type: CategoryDto,
  })
  category?: CategoryDto | null;

  @ApiProperty({
    description: 'Products associated with this FAQ',
    type: [FaqProductSummaryDto],
  })
  products!: FaqProductSummaryDto[];
}
