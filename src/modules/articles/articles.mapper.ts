import type { operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import { mapAuthor } from '../authors/authors.mapper';
import { mapCategory } from '../categories/categories.mapper';
import {
  mapMediaArray,
  mapMediaSummary,
  removeUndefined,
  stripInternalFields,
} from '../../common/utils/cms-mapper';
import { mapTag } from '../tags/tags.mapper';
import type { ArticleDto } from './articles.dto';

export type CmsArticle =
  operations['article/get/articles_by_id']['responses'][200]['content']['application/json']['data'];

export type CmsArticleListItem =
  operations['article/get/articles']['responses'][200]['content']['application/json']['data'][number];

type CmsArticleUnion = CmsArticle | CmsArticleListItem;

export function mapArticle(entity: CmsArticleUnion): ArticleDto {
  const article: ArticleDto = removeUndefined({
    documentId: entity.documentId,
    title: entity.title ?? undefined,
    description: entity.description ?? undefined,
    content: entity.content.map(stripInternalFields),
    slug: entity.slug ?? undefined,
    publish_date: entity.publish_date ?? undefined,
    articleType: entity.articleType ?? undefined,
    customerSegment: entity.customerSegment,
    isFeatured: entity.isFeatured ?? undefined,
    blocks: entity.blocks?.map(stripInternalFields),
    seo: entity.seo ? stripInternalFields(entity.seo) : undefined,
  });

  if ('cover' in entity) {
    article.cover = mapMediaSummary(entity.cover);
  }
  if ('thumbnail' in entity) {
    article.thumbnail = mapMediaSummary(entity.thumbnail);
  }
  if ('attachments' in entity && Array.isArray(entity.attachments)) {
    article.attachments = mapMediaArray(entity.attachments);
  }
  if ('tags' in entity && Array.isArray(entity.tags)) {
    article.tags = entity.tags.map(mapTag);
  }
  if ('author' in entity) {
    article.author = entity.author ? mapAuthor(entity.author) : entity.author;
  }
  if ('category' in entity) {
    article.category = entity.category
      ? mapCategory(entity.category)
      : entity.category;
  }
  if ('relatedProducts' in entity && Array.isArray(entity.relatedProducts)) {
    article.relatedProducts = entity.relatedProducts.map(({ documentId, name, slug }) =>
      removeUndefined({ documentId, name: name ?? undefined, slug: slug ?? undefined }),
    );
  }
  if ('relatedArticles' in entity && Array.isArray(entity.relatedArticles)) {
    article.relatedArticles = entity.relatedArticles.map(({ documentId, title, slug }) =>
      removeUndefined({ documentId, title: title ?? undefined, slug: slug ?? undefined }),
    );
  }

  return article;
}

export function mapArticles(entities: CmsArticleListItem[]): ArticleDto[] {
  return entities.map(mapArticle);
}
