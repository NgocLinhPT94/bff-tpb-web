import { mapCategory, type CategoryDto } from '../categories/categories.mapper';
import {
  getArray,
  getBoolean,
  getString,
  mapMediaSummary,
  mapOptionalRelation,
  mapRelationArray,
  removeUndefined,
  stripInternalFields,
  type MediaSummaryDto,
  type StrapiEntity,
} from '../shared/strapi-mapper';

export interface ProductSummaryDto {
  documentId?: string;
  name?: string;
  slug?: string;
  product_type?: string;
  short_description?: string;
  thumbnail?: MediaSummaryDto | null;
}

export interface FaqDto {
  documentId?: string;
  question?: string;
  answer?: unknown[];
  active?: boolean;
  category?: CategoryDto | null;
  products?: ProductSummaryDto[];
}

export function mapFaq(entity: StrapiEntity): FaqDto {
  const faq: FaqDto = removeUndefined({
    documentId: getString(entity.documentId),
    question: getString(entity.question),
    answer: getArray(entity.answer)?.map(stripInternalFields),
    active: getBoolean(entity.active),
  });

  if ('category' in entity) {
    faq.category = mapOptionalRelation(entity.category, mapCategory);
  }

  if ('products' in entity) {
    faq.products = mapRelationArray(entity.products, mapProductSummary);
  }

  return faq;
}

export function mapFaqs(entities: StrapiEntity[]): FaqDto[] {
  return entities.map(mapFaq);
}

export function mapProductSummary(entity: StrapiEntity): ProductSummaryDto {
  const product: ProductSummaryDto = removeUndefined({
    documentId: getString(entity.documentId),
    name: getString(entity.name),
    slug: getString(entity.slug),
    product_type: getString(entity.product_type),
    short_description: getString(entity.short_description),
  });

  if ('thumbnail' in entity) {
    product.thumbnail = mapMediaSummary(entity.thumbnail);
  }

  return product;
}
