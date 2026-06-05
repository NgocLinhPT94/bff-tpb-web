import type { CmsProduct } from '../../infrastructure/strapi/cms-types';
import {
  getString,
  mapMediaSummary,
  mapMediaArray,
  removeUndefined,
} from '../shared/strapi-mapper';
import {
  ProductType,
  type ProductDto,
  type ProductFaqSummaryDto,
  type ProductPromotionSummaryDto,
} from './products.dto';

const PRODUCT_TYPES = new Set<string>(Object.values(ProductType));

export function mapProduct(product: CmsProduct): ProductDto {
  return removeUndefined({
    documentId: product.documentId,
    name: product.name ?? undefined,
    slug: product.slug ?? undefined,
    productType: mapProductType(product.product_type),
    shortDescription: product.short_description ?? undefined,
    thumbnail: mapMediaSummary(product.thumbnail) ?? undefined,
    mainBanner: mapMediaSummary(product.main_banner) ?? undefined,
    documents: mapMediaArray(product.documents),
    faqs: mapFaqSummaries(product.faqs),
    promotions: mapPromotionSummaries(product.promotions),
  });
}

export function mapProducts(products: CmsProduct[]): ProductDto[] {
  return products.map((product) => mapProduct(product));
}

function mapProductType(
  value: string | null | undefined,
): ProductType | undefined {
  if (!value || !PRODUCT_TYPES.has(value)) {
    return undefined;
  }

  return value as ProductType;
}

function mapFaqSummaries(
  faqs: CmsProduct['faqs'] | null | undefined,
): ProductFaqSummaryDto[] {
  if (!faqs?.length) {
    return [];
  }

  return faqs.flatMap((faq) => {
    if (typeof faq.documentId !== 'string') {
      return [];
    }

    return [
      removeUndefined({
        documentId: faq.documentId,
        question: getString(faq.question),
      }),
    ];
  });
}

function mapPromotionSummaries(
  promotions: CmsProduct['promotions'] | null | undefined,
): ProductPromotionSummaryDto[] {
  if (!promotions?.length) {
    return [];
  }

  return promotions.flatMap((promotion) => {
    if (typeof promotion.documentId !== 'string') {
      return [];
    }

    return [
      removeUndefined({
        documentId: promotion.documentId,
        title: getString(promotion.title),
        slug: getString(promotion.slug),
      }),
    ];
  });
}
