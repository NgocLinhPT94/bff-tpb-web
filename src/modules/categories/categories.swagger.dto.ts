import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Category DTO for Swagger documentation.
 */
export class CategorySwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'cat-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Personal Finance',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'personal-finance',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Articles about managing personal finances and budgeting.',
  })
  description?: string;
}
