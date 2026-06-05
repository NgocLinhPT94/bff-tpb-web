import type { CmsAbout } from '../../infrastructure/strapi/cms-types';
import { removeUndefined, sanitizePublicValue } from '../shared/strapi-mapper';

type AboutMapperInput = Omit<CmsAbout, 'blocks'> & {
  blocks?: CmsAbout['blocks'] | null;
};

export interface AboutDto {
  documentId: string;
  title?: string;
  blocks: unknown[];
}

export function mapAbout(about: AboutMapperInput): AboutDto {
  return removeUndefined({
    documentId: about.documentId,
    title: about.title ?? undefined,
    blocks: Array.isArray(about.blocks)
      ? about.blocks.map((block) => sanitizePublicValue(block))
      : [],
  });
}
