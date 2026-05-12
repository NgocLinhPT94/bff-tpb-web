import { removeUndefined, sanitizePublicValue } from '../shared/strapi-mapper';

export interface StrapiAbout {
  documentId: string;
  title?: string | null;
  blocks?: unknown[] | null;
}

export interface AboutDto {
  documentId: string;
  title?: string;
  blocks: unknown[];
}

export function mapAbout(about: StrapiAbout): AboutDto {
  return removeUndefined({
    documentId: about.documentId,
    title: about.title ?? undefined,
    blocks: Array.isArray(about.blocks)
      ? about.blocks.map((block) => sanitizePublicValue(block))
      : [],
  });
}
