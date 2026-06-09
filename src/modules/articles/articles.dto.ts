import type { MediaSummaryDto, RelationSummaryDto } from '../../common/utils/cms-mapper';
import type { TagDto } from '../tags/tags.dto';
import type { AuthorDto } from '../authors/authors.dto';
import type { CategoryDto } from '../categories/categories.dto';

export type ArticleType = 'news' | 'blog' | 'press_release' | 'announcement';

export type { TagDto };

export interface ArticleDto {
  documentId: string;
  title?: string;
  description?: string;
  content: unknown[];
  slug?: string;
  publish_date?: string;
  articleType?: ArticleType;
  customerSegment: string;
  isFeatured?: boolean;
  tags?: TagDto[];
  blocks?: unknown[];
  seo?: unknown;
  cover?: MediaSummaryDto | null;
  thumbnail?: MediaSummaryDto | null;
  attachments?: MediaSummaryDto[];
  author?: AuthorDto | null;
  category?: CategoryDto | null;
  relatedProducts?: RelationSummaryDto[];
  relatedArticles?: RelationSummaryDto[];
}
