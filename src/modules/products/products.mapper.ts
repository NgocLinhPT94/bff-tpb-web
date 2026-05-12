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

export interface ProductStrapiEntity {
  documentId: string;
  name?: string | null;
  slug?: string | null;
  product_type?: string | null;
  short_description?: string | null;
  thumbnail?: unknown;
  main_banner?: unknown;
  documents?: unknown;
  faqs?: Record<string, unknown>[] | null;
  promotions?: Record<string, unknown>[] | null;
  [key: string]: unknown;
}

const PRODUCT_TYPES = new Set<string>(Object.values(ProductType));

export function mapProduct(product: ProductStrapiEntity): ProductDto {
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

export function mapProducts(products: ProductStrapiEntity[]): ProductDto[] {
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
  faqs: Record<string, unknown>[] | null | undefined,
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
  promotions: Record<string, unknown>[] | null | undefined,
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
