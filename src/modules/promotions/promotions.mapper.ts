import type { CmsPromotion } from '../../infrastructure/strapi/cms-types';
import {
  getArray,
  getString,
  mapMediaArray,
  removeUndefined,
} from '../shared/strapi-mapper';
import type {
  PromotionDto,
  PromotionProductSummaryDto,
} from './promotions.dto';

export function mapPromotion(promotion: CmsPromotion): PromotionDto {
  return removeUndefined({
    documentId: promotion.documentId,
    title: promotion.title ?? undefined,
    slug: promotion.slug ?? undefined,
    shortDescription: promotion.short_description ?? undefined,
    content: getArray(promotion.content),
    startDate: promotion.start_date ?? undefined,
    endDate: promotion.end_date ?? undefined,
    ctaLabel: promotion.cta_label ?? undefined,
    ctaLink: promotion.cta_link ?? undefined,
    banner: mapMediaArray(promotion.banner),
    products: mapProductSummaries(promotion.products),
  });
}

export function mapPromotions(promotions: CmsPromotion[]): PromotionDto[] {
  return promotions.map((promotion) => mapPromotion(promotion));
}

function mapProductSummaries(
  products: CmsPromotion['products'] | null | undefined,
): PromotionProductSummaryDto[] {
  if (!products?.length) {
    return [];
  }

  return products.flatMap((product) => {
    if (typeof product.documentId !== 'string') {
      return [];
    }

    return [
      removeUndefined({
        documentId: product.documentId,
        name: getString(product.name),
        slug: getString(product.slug),
      }),
    ];
  });
}
