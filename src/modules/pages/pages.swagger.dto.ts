import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageTemplate, PageWorkflowState } from './pages.dto.js';

/**
 * Page DTO for Swagger documentation.
 */
export class PageSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'page-001',
  })
  documentId!: string;

  @ApiPropertyOptional({
    description: 'Page title',
    example: 'Home Page',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Page description',
    example: 'Welcome to TPBank digital banking services.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'home',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Page template type',
    enum: PageTemplate,
    example: PageTemplate.HOME,
  })
  template?: PageTemplate;

  @ApiPropertyOptional({
    description: 'Page workflow state',
    enum: PageWorkflowState,
    example: PageWorkflowState.PUBLISHED,
  })
  workflowState?: PageWorkflowState;

  @ApiPropertyOptional({
    description: 'Publication date (ISO 8601)',
    example: '2024-01-15T00:00:00.000Z',
  })
  publishDate?: string;

  @ApiPropertyOptional({
    description: 'Page sections as dynamic content blocks',
    example: [{ __component: 'blocks.rich-text', content: '...' }],
  })
  sections?: unknown[];
}
