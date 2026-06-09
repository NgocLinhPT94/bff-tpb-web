import type { components, operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import { mapCategory } from '../categories/categories.mapper';
import {
  mapMediaSummary,
  removeUndefined,
  stripInternalFields,
} from '../../common/utils/cms-mapper';
import type { FaqDto, ProductSummaryDto } from './faqs.dto';

export type CmsFaq =
  operations['faq/get/faqs_by_id']['responses'][200]['content']['application/json']['data'];

export type CmsFaqListItem =
  operations['faq/get/faqs']['responses'][200]['content']['application/json']['data'][number];

type CmsProductDocument = components['schemas']['ApiProductProductDocument'];

export function mapFaq(entity: CmsFaq | CmsFaqListItem): FaqDto {
  const faq: FaqDto = removeUndefined({
    documentId: entity.documentId,
    question: entity.question ?? undefined,
    answer: entity.answer?.map(stripInternalFields),
    slug: entity.slug ?? undefined,
    active: entity.active ?? undefined,
    sortOrder: entity.sortOrder ?? undefined,
  });

  if ('category' in entity) {
    faq.category = entity.category
      ? mapCategory(entity.category)
      : entity.category;
  }

  if ('product' in entity) {
    faq.product = entity.product
      ? mapProductSummary(entity.product)
      : entity.product;
  }

  return faq;
}

export function mapFaqs(entities: CmsFaqListItem[]): FaqDto[] {
  return entities.map(mapFaq);
}

export function mapProductSummary(entity: CmsProductDocument): ProductSummaryDto {
  const product: ProductSummaryDto = removeUndefined({
    documentId: entity.documentId,
    name: entity.name ?? undefined,
    slug: entity.slug ?? undefined,
    product_type: entity.product_type ?? undefined,
    short_description: entity.short_description ?? undefined,
  });

  if ('thumbnail' in entity) {
    product.thumbnail = mapMediaSummary(entity.thumbnail);
  }

  return product;
}
