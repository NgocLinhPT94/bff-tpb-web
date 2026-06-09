import { mapMediaSummary, removeUndefined, type CmsOperationData } from '../../common/utils/cms-mapper';
import type { components } from '../../integrations/cms/generated/cms-schema.d.ts';
import type { AuthorDto } from './authors.dto';

export type CmsAuthor = CmsOperationData<'author/get/authors_by_id'>;

export type CmsAuthorListItem = CmsOperationData<'author/get/authors'>[number];

export function mapAuthor(entity: CmsAuthor | CmsAuthorListItem): AuthorDto {
  const author: AuthorDto = removeUndefined({
    documentId: entity.documentId,
    name: entity.name,
    email: entity.email ?? undefined,
    title: entity.title ?? undefined,
    bio: entity.bio ?? undefined,
  });

  if ('avatar' in entity) {
    author.avatar = mapMediaSummary(entity.avatar as components['schemas']['PluginUploadFileDocument'] | null | undefined);
  }

  return author;
}

export function mapAuthors(entities: CmsAuthorListItem[]): AuthorDto[] {
  return entities.map(mapAuthor);
}
