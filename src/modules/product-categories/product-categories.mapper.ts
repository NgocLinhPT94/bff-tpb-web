import type { operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import {
  mapMediaArray,
  mapMediaSummary,
  mapRelationSummaries,
  removeUndefined,
  stripInternalFields,
} from '../../common/utils/cms-mapper';
import type { ProductCategoryDto } from './product-categories.dto';

export type CmsProductCategory =
  operations['product-category/get/product_categories_by_id']['responses'][200]['content']['application/json']['data'];

export type CmsProductCategoryListItem =
  operations['product-category/get/product_categories']['responses'][200]['content']['application/json']['data'][number];

export function mapProductCategory(
  entity: CmsProductCategory | CmsProductCategoryListItem,
): ProductCategoryDto {
  return removeUndefined({
    documentId: entity.documentId,
    name: entity.name,
    slug: entity.slug,
    description: entity.description ?? undefined,
    icon: mapMediaSummary(entity.icon) ?? undefined,
    bannerImage: mapMediaArray(entity.bannerImage),
    sortOrder: entity.sortOrder ?? undefined,
    isActive: entity.isActive ?? undefined,
    seo: entity.seo ? stripInternalFields(entity.seo) : undefined,
    publishedDate: entity.publishedDate ?? undefined,
    products: mapRelationSummaries(entity.ProductCategory),
    promotions: mapRelationSummaries(entity.promotions),
  });
}

export function mapProductCategories(
  entities: CmsProductCategoryListItem[],
): ProductCategoryDto[] {
  return entities.map(mapProductCategory);
}
