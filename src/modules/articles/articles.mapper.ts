import type { CmsArticle } from '../../infrastructure/strapi/cms-types';
import { mapAuthor, type AuthorDto } from '../authors/authors.mapper';
import { mapCategory, type CategoryDto } from '../categories/categories.mapper';
import {
  getArray,
  getString,
  mapMediaSummary,
  mapOptionalRelation,
  removeUndefined,
  stripInternalFields,
  type MediaSummaryDto,
} from '../shared/strapi-mapper';

export interface ArticleDto {
  documentId?: string;
  title?: string;
  description?: string;
  content?: unknown[];
  slug?: string;
  publish_date?: string;
  blocks?: unknown[];
  seo?: unknown;
  cover?: MediaSummaryDto | null;
  author?: AuthorDto | null;
  category?: CategoryDto | null;
}

export function mapArticle(entity: CmsArticle): ArticleDto {
  const article: ArticleDto = removeUndefined({
    documentId: getString(entity.documentId),
    title: getString(entity.title),
    description: getString(entity.description),
    content: getArray(entity.content)?.map(stripInternalFields),
    slug: getString(entity.slug),
    publish_date: getString(entity.publish_date),
    blocks: getArray(entity.blocks)?.map(stripInternalFields),
    seo: stripOptional(entity.seo),
  });

  if ('cover' in entity) {
    article.cover = mapMediaSummary(entity.cover);
  }

  if ('author' in entity) {
    article.author = mapOptionalRelation(entity.author, mapAuthor);
  }

  if ('category' in entity) {
    article.category = mapOptionalRelation(entity.category, mapCategory);
  }

  return article;
}

export function mapArticles(entities: CmsArticle[]): ArticleDto[] {
  return entities.map(mapArticle);
}

function stripOptional(value: unknown): unknown {
  return value === undefined ? undefined : stripInternalFields(value);
}
