import { removeUndefined, type CmsOperationData } from '../../common/utils/cms-mapper';
import type { CategoryDto } from './categories.dto';

export type CmsCategory = CmsOperationData<'category/get/categories_by_id'>;

export type CmsCategoryListItem = CmsOperationData<'category/get/categories'>[number];

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
