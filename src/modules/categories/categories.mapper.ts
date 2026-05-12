import {
  getString,
  removeUndefined,
  type StrapiEntity,
} from '../shared/strapi-mapper';

export interface CategoryDto {
  documentId?: string;
  name?: string;
  slug?: string;
  description?: string;
}

export function mapCategory(entity: StrapiEntity): CategoryDto {
  return removeUndefined({
    documentId: getString(entity.documentId),
    name: getString(entity.name),
    slug: getString(entity.slug),
    description: getString(entity.description),
  });
}

export function mapCategories(entities: StrapiEntity[]): CategoryDto[] {
  return entities.map(mapCategory);
}
