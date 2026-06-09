import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaSummarySwaggerDto } from '../../common/swagger/common.swagger.dto.js';
import { AuthorSwaggerDto } from '../authors/authors.swagger.dto.js';
import { CategorySwaggerDto } from '../categories/categories.swagger.dto.js';

export class TagSwaggerDto {
  @ApiProperty({ description: 'Unique document identifier', example: 'tag-001' })
  documentId!: string;

  @ApiProperty({ description: 'Tag name', example: 'Digital Banking' })
  name!: string;

  @ApiProperty({ description: 'Tag slug', example: 'digital-banking' })
  slug!: string;
}

/**
 * Article DTO for Swagger documentation.
 */
export class ArticleSwaggerDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'article-001',
  })
  documentId!: string;

  @ApiPropertyOptional({ description: 'Article title', example: 'Introducing Our New Digital Banking Platform' })
  title?: string;

  @ApiPropertyOptional({ description: 'Short description or excerpt', example: 'Experience banking like never before.' })
  description?: string;

  @ApiPropertyOptional({ description: 'Article content as structured blocks', example: [{ type: 'paragraph', content: 'Welcome to...' }] })
  content?: unknown[];

  @ApiPropertyOptional({ description: 'URL slug', example: 'introducing-new-digital-banking' })
  slug?: string;

  @ApiPropertyOptional({ description: 'Publication date (ISO 8601)', example: '2024-01-15T00:00:00.000Z' })
  publish_date?: string;

  @ApiPropertyOptional({ description: 'Article type', enum: ['news', 'blog', 'press_release', 'announcement'] })
  articleType?: string;

  @ApiPropertyOptional({ description: 'Customer segment', enum: ['individual', 'corporate', 'priority', 'all'] })
  customerSegment?: string;

  @ApiPropertyOptional({ description: 'Whether the article is featured', example: true })
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Tags', type: [TagSwaggerDto] })
  tags?: TagSwaggerDto[];

  @ApiPropertyOptional({ description: 'Dynamic content blocks', example: [{ type: 'hero', title: 'Welcome' }] })
  blocks?: unknown[];

  @ApiPropertyOptional({ description: 'SEO metadata', example: { metaTitle: '...', metaDescription: '...' } })
  seo?: unknown;

  @ApiPropertyOptional({ description: 'Cover image', type: MediaSummarySwaggerDto })
  cover?: MediaSummarySwaggerDto | null;

  @ApiPropertyOptional({ description: 'Thumbnail image', type: MediaSummarySwaggerDto })
  thumbnail?: MediaSummarySwaggerDto | null;

  @ApiPropertyOptional({ description: 'Article author', type: AuthorSwaggerDto })
  author?: AuthorSwaggerDto | null;

  @ApiPropertyOptional({ description: 'Article category', type: CategorySwaggerDto })
  category?: CategorySwaggerDto | null;
}
