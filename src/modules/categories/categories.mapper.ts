import { removeUndefined } from '../../common/utils/cms-mapper';
import type { operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import type { CategoryDto } from './categories.dto';

export type CmsCategory =
  operations['category/get/categories_by_id']['responses'][200]['content']['application/json']['data'];

export type CmsCategoryListItem =
  operations['category/get/categories']['responses'][200]['content']['application/json']['data'][number];

export function mapCategory(entity: CmsCategory | CmsCategoryListItem): CategoryDto {
  return removeUndefined({
    documentId: entity.documentId,
    name: entity.name,
    slug: entity.slug,
    description: entity.description ?? undefined,
  });
}

export function mapCategories(entities: CmsCategoryListItem[]): CategoryDto[] {
  return entities.map(mapCategory);
}
