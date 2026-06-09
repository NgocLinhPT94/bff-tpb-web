import { removeUndefined, sanitizePublicValue, type CmsOperationData } from '../../common/utils/cms-mapper';
import type { AboutDto } from './about.dto';

export type CmsAbout = CmsOperationData<'about/get/about'>;

export function mapAbout(about: CmsAbout): AboutDto {
  return removeUndefined({
    documentId: about.documentId,
    title: about.title ?? undefined,
    blocks: Array.isArray(about.blocks)
      ? about.blocks.map((block) => sanitizePublicValue(block))
      : [],
  });
}
