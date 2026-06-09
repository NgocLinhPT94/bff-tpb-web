import { type CmsOperationData } from '../../common/utils/cms-mapper';
import type { TagDto } from './tags.dto';

export type CmsTag = CmsOperationData<'tag/get/tags_by_id'>;

export type CmsTagListItem = CmsOperationData<'tag/get/tags'>[number];

export function mapTag(entity: CmsTag | CmsTagListItem): TagDto {
  return {
    documentId: entity.documentId,
    name: entity.name,
    slug: entity.slug,
  };
}
