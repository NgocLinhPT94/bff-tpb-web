import type { CmsCategory } from '../../infrastructure/strapi/cms-types';
import { getString, removeUndefined } from '../shared/strapi-mapper';

type CategoryMapperInput =
  | CmsCategory
  | (Record<string, unknown> & {
      articles?: unknown;
      faqs?: unknown;
    });

export interface CategoryDto {
  documentId?: string;
  name?: string;
  slug?: string;
  description?: string;
}

export function mapCategory(entity: CategoryMapperInput): CategoryDto {
  return removeUndefined({
    documentId: getString(entity.documentId),
    name: getString(entity.name),
    slug: getString(entity.slug),
    description: getString(entity.description),
  });
}

export function mapCategories(entities: CmsCategory[]): CategoryDto[] {
  return entities.map(mapCategory);
}
