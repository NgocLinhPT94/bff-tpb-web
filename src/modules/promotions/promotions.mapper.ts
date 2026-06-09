import type { components } from '../../integrations/cms/generated/cms-schema.d.ts';
import {
  mapMediaArray,
  mapRelationSummaries,
  removeUndefined,
  stripInternalFields,
} from '../../common/utils/cms-mapper';
import type { CmsOperationData } from '../../common/utils/cms-mapper';
import { mapTag } from '../tags/tags.mapper';
import type {
  PromotionDto,
  PromotionProductSummaryDto,
  PromotionCustomerSegment,
  PromotionApplicableCard,
  PromotionTargetAudience,
} from './promotions.dto';

export type PromotionCmsEntity = CmsOperationData<'promotion/get/promotions_by_id'>;

export type PromotionCmsListItem = CmsOperationData<'promotion/get/promotions'>[number];

type CmsPromotion = PromotionCmsEntity | PromotionCmsListItem;

type CmsProductDocument = components['schemas']['ApiProductProductDocument'];
type CmsProductCategoryDocument = components['schemas']['ApiProductCategoryProductCategoryDocument'];
const VALID_CUSTOMER_SEGMENTS = new Set<string>(['individual', 'corporate', 'priority', 'all']);
const VALID_APPLICABLE_CARDS = new Set<string>(['Visa', 'Mastercard', 'JCB']);
const VALID_TARGET_AUDIENCES = new Set<string>(['Cá nhân', 'Doanh nghiệp', 'Tất cả']);

function mapPromotionEnum<T extends string>(
  value: string | null | undefined,
  validValues: Set<string>,
): T | undefined {
  if (!value || !validValues.has(value)) return undefined;
  return value as T;
}

export function mapPromotion(promotion: CmsPromotion): PromotionDto {
  return removeUndefined({
    documentId: promotion.documentId,
    title: promotion.title,
    slug: promotion.slug,
    shortDescription: promotion.short_description ?? undefined,
    content: promotion.content?.map(stripInternalFields),
    startDate: promotion.start_date ?? undefined,
    endDate: promotion.end_date ?? undefined,
    ctaLabel: promotion.cta_label ?? undefined,
    ctaLink: promotion.cta_link ?? undefined,
    ctaUrl: promotion.ctaUrl ?? undefined,
    customerSegment: mapPromotionEnum<PromotionCustomerSegment>(promotion.customerSegment, VALID_CUSTOMER_SEGMENTS),
    applicableCards: mapPromotionEnum<PromotionApplicableCard>(promotion.applicableCards, VALID_APPLICABLE_CARDS),
    targetAudience: mapPromotionEnum<PromotionTargetAudience>(promotion.targetAudience, VALID_TARGET_AUDIENCES),
    tags: promotion.tags?.map(mapTag),
    priority: promotion.priority ?? undefined,
    isFeatured: promotion.isFeatured ?? undefined,
    displayLocations: promotion.displayLocations ?? undefined,
    termsConditions: promotion.termsConditions?.map(stripInternalFields),
    seo: promotion.seo ? stripInternalFields(promotion.seo) : undefined,
    publishedDate: promotion.publishedDate ?? undefined,
    banner: mapMediaArray(promotion.banner),
    products: mapProductSummaries(promotion.products),
    applicableProducts: mapProductSummaries(promotion.applicableProducts),
    categories: mapRelationSummaries(promotion.categories),
  });
}

export function mapPromotions(promotions: PromotionCmsListItem[]): PromotionDto[] {
  return promotions.map(mapPromotion);
}

function mapProductSummaries(
  products: CmsProductDocument[] | null | undefined,
): PromotionProductSummaryDto[] {
  if (!products?.length) return [];

  return products.map(({ documentId, name, slug }) =>
    removeUndefined({
      documentId,
      name: name ?? undefined,
      slug: slug ?? undefined,
    }),
  );
}

function mapCategorySummaries(
  categories: CmsProductCategoryDocument[] | null | undefined,
) {
  return mapRelationSummaries(categories);
}
