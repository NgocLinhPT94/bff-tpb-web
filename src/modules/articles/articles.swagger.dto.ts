import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuthorDto } from '../authors/authors.swagger.dto';
import { CategoryDto } from '../categories/categories.swagger.dto';
import { MediaSummaryDto } from '../../common/swagger/common.swagger.dto';

/**
 * Article DTO for Swagger documentation.
 */
export class ArticleDto {
  @ApiPropertyOptional({
    description: 'Unique document identifier',
    example: 'article-001',
  })
  documentId?: string;

  @ApiPropertyOptional({
    description: 'Article title',
    example: 'Introducing Our New Digital Banking Platform',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Short description or excerpt',
    example:
      'Experience banking like never before with our new digital platform.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Article content as structured blocks',
    example: [{ type: 'paragraph', content: 'Welcome to...' }],
  })
  content?: unknown[];

  @ApiPropertyOptional({
    description: 'URL slug',
    example: 'introducing-new-digital-banking',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Publication date (ISO 8601)',
    example: '2024-01-15T00:00:00.000Z',
  })
  publish_date?: string;

  @ApiPropertyOptional({
    description: 'Dynamic content blocks',
    example: [{ type: 'hero', title: 'Welcome' }],
  })
  blocks?: unknown[];

  @ApiPropertyOptional({
    description: 'SEO metadata',
    example: { metaTitle: '...', metaDescription: '...' },
  })
  seo?: unknown;

  @ApiPropertyOptional({
    description: 'Cover image',
    type: MediaSummaryDto,
  })
  cover?: MediaSummaryDto | null;

  @ApiPropertyOptional({
    description: 'Article author',
    type: AuthorDto,
  })
  author?: AuthorDto | null;

  @ApiPropertyOptional({
    description: 'Article category',
    type: CategoryDto,
  })
  category?: CategoryDto | null;
}
