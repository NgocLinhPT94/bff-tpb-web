import type { components, operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import {
  mapMediaArray,
  mapMediaSummary,
  mapRelationSummaries,
  mapRelationSummary,
  removeUndefined,
  stripInternalFields,
} from '../../common/utils/cms-mapper';
import { mapTag } from '../tags/tags.mapper';
import {
  ProductType,
  ProductStatus,
  CustomerSegment,
  TargetAudience,
  type ProductDto,
  type ProductFaqSummaryDto,
  type ProductPromotionSummaryDto,
} from './products.dto';

export type ProductCmsEntity =
  operations['product/get/products_by_id']['responses'][200]['content']['application/json']['data'];

export type ProductCmsListItem =
  operations['product/get/products']['responses'][200]['content']['application/json']['data'][number];

type CmsProduct = ProductCmsEntity | ProductCmsListItem;

type CmsFaqDocument = components['schemas']['ApiFaqFaqDocument'];
type CmsPromotionDocument = components['schemas']['ApiPromotionPromotionDocument'];

const PRODUCT_TYPES = new Set<string>(Object.values(ProductType));
const PRODUCT_STATUSES = new Set<string>(Object.values(ProductStatus));
const CUSTOMER_SEGMENTS = new Set<string>(Object.values(CustomerSegment));
const TARGET_AUDIENCES = new Set<string>(Object.values(TargetAudience));

function mapEnum<T extends string>(
  value: string | null | undefined,
  validValues: Set<string>,
): T | undefined {
  if (!value || !validValues.has(value)) return undefined;
  return value as T;
}

export function mapProduct(product: CmsProduct): ProductDto {
  return removeUndefined({
    documentId: product.documentId,
    name: product.name,
    slug: product.slug,
    productType: mapEnum<ProductType>(product.product_type, PRODUCT_TYPES),
    statusProduct: mapEnum<ProductStatus>(product.statusProduct, PRODUCT_STATUSES),
    customerSegment: mapEnum<CustomerSegment>(product.customerSegment, CUSTOMER_SEGMENTS),
    targetAudience: mapEnum<TargetAudience>(product.targetAudience, TARGET_AUDIENCES),
    shortDescription: product.short_description ?? undefined,
    description: product.description?.map(stripInternalFields),
    thumbnail: mapMediaSummary(product.thumbnail) ?? undefined,
    mainBanner: mapMediaSummary(product.main_banner) ?? undefined,
    coverImage: mapMediaSummary(product.coverImage) ?? undefined,
    images: mapMediaArray(product.images),
    documents: mapMediaArray(product.documents),
    seo: product.seo ? stripInternalFields(product.seo) : undefined,
    tags: product.tags?.map(mapTag),
    features: product.features?.map(stripInternalFields),
    benefits: product.benefits?.map(stripInternalFields),
    sortOrder: product.sortOrder ?? undefined,
    interestRateMin: product.interestRateMin ?? undefined,
    interestRateMax: product.interestRateMax ?? undefined,
    loanAmountMin: product.loanAmountMin ?? undefined,
    loanAmountMax: product.loanAmountMax ?? undefined,
    tenor: product.tenor ?? undefined,
    applyUrl: product.applyUrl ?? undefined,
    category: mapRelationSummary(product.category),
    relatedProducts: mapRelationSummaries(product.relatedProducts),
    relatedArticles: mapRelationSummaries(product.relatedArticles),
    applicablePromotions: mapRelationSummaries(product.applicablePromotions),
    faqs: mapFaqSummaries(product.faqs),
    promotions: mapPromotionSummaries(product.promotions),
  });
}

export function mapProducts(products: ProductCmsListItem[]): ProductDto[] {
  return products.map(mapProduct);
}

function mapFaqSummaries(
  faqs: CmsFaqDocument[] | null | undefined,
): ProductFaqSummaryDto[] {
  if (!faqs?.length) return [];

  return faqs.map(({ documentId, question }) =>
    removeUndefined({
      documentId,
      question: question ?? undefined,
    }),
  );
}

function mapPromotionSummaries(
  promotions: CmsPromotionDocument[] | null | undefined,
): ProductPromotionSummaryDto[] {
  if (!promotions?.length) return [];

  return promotions.map(({ documentId, title, slug }) =>
    removeUndefined({
      documentId,
      title: title ?? undefined,
      slug: slug ?? undefined,
    }),
  );
}
