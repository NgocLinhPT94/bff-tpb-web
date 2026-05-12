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

export interface PromotionStrapiEntity {
  documentId: string;
  title?: string | null;
  slug?: string | null;
  short_description?: string | null;
  content?: unknown;
  start_date?: string | null;
  end_date?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  banner?: unknown;
  products?: Record<string, unknown>[] | null;
  [key: string]: unknown;
}

export function mapPromotion(promotion: PromotionStrapiEntity): PromotionDto {
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

export function mapPromotions(
  promotions: PromotionStrapiEntity[],
): PromotionDto[] {
  return promotions.map((promotion) => mapPromotion(promotion));
}

function mapProductSummaries(
  products: Record<string, unknown>[] | null | undefined,
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
