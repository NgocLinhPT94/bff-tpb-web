import type { operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import type { TagDto } from './tags.dto';

export type CmsTag =
  operations['tag/get/tags_by_id']['responses'][200]['content']['application/json']['data'];

export type CmsTagListItem =
  operations['tag/get/tags']['responses'][200]['content']['application/json']['data'][number];

export function mapTag(entity: CmsTag | CmsTagListItem): TagDto {
  return {
    documentId: entity.documentId,
    name: entity.name,
    slug: entity.slug,
  };
}
