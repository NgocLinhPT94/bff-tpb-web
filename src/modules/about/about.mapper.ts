import { removeUndefined, sanitizePublicValue } from '../../common/utils/cms-mapper';
import type { operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import type { AboutDto } from './about.dto';

export type CmsAbout =
  operations['about/get/about']['responses'][200]['content']['application/json']['data'];

export function mapAbout(about: CmsAbout): AboutDto {
  return removeUndefined({
    documentId: about.documentId,
    title: about.title ?? undefined,
    blocks: Array.isArray(about.blocks)
      ? about.blocks.map((block) => sanitizePublicValue(block))
      : [],
  });
}
