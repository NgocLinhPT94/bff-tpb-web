import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Category DTO for Swagger documentation.
 */
export class CategoryDto {
  @ApiPropertyOptional({
    description: 'Unique document identifier',
    example: 'category-001',
  })
  documentId?: string;

  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Banking News',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'banking-news',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Latest news and updates from the banking industry',
  })
  description?: string;
}
