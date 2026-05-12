import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Page DTO for Swagger documentation.
 */
export class PageDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'page-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Page title',
    example: 'About Us',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Page description for SEO',
    example: 'Learn more about TPBank and our mission.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'about-us',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Page template identifier',
    example: 'default',
  })
  template?: string;

  @ApiPropertyOptional({
    description: 'Workflow state',
    example: 'published',
  })
  workflowState?: string;

  @ApiPropertyOptional({
    description: 'Publication date (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  publishDate?: string;

  @ApiProperty({
    description: 'Page sections as structured blocks',
    example: [{ type: 'hero', title: 'Welcome' }],
  })
  sections!: unknown[];
}
