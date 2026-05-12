import {
  getString,
  mapMediaSummary,
  removeUndefined,
  type MediaSummaryDto,
  type StrapiEntity,
} from '../shared/strapi-mapper';

export interface AuthorDto {
  documentId?: string;
  name?: string;
  email?: string;
  avatar?: MediaSummaryDto | null;
}

export function mapAuthor(entity: StrapiEntity): AuthorDto {
  const author: AuthorDto = removeUndefined({
    documentId: getString(entity.documentId),
    name: getString(entity.name),
    email: getString(entity.email),
  });

  if ('avatar' in entity) {
    author.avatar = mapMediaSummary(entity.avatar);
  }

  return author;
}

export function mapAuthors(entities: StrapiEntity[]): AuthorDto[] {
  return entities.map(mapAuthor);
}
