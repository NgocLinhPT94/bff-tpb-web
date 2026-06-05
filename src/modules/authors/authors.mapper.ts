import type { CmsAuthor } from '../../infrastructure/strapi/cms-types';
import {
  getString,
  mapMediaSummary,
  removeUndefined,
  type MediaSummaryDto,
} from '../shared/strapi-mapper';

type AuthorMapperInput =
  | CmsAuthor
  | (Record<string, unknown> & {
      avatar?: unknown;
    });

export interface AuthorDto {
  documentId?: string;
  name?: string;
  email?: string;
  avatar?: MediaSummaryDto | null;
}

export function mapAuthor(entity: AuthorMapperInput): AuthorDto {
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

export function mapAuthors(entities: CmsAuthor[]): AuthorDto[] {
  return entities.map(mapAuthor);
}
