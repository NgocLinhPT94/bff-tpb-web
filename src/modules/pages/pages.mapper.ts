import { removeUndefined, sanitizePublicValue } from '../shared/strapi-mapper';

export interface StrapiPage {
  documentId: string;
  title?: string | null;
  description?: string | null;
  slug?: string | null;
  template?: string | null;
  workflowState?: string | null;
  publishDate?: string | null;
  sections?: unknown[] | null;
}

export interface PageDto {
  documentId: string;
  title?: string;
  description?: string;
  slug?: string;
  template?: string;
  workflowState?: string;
  publishDate?: string;
  sections: unknown[];
}

export function mapPage(page: StrapiPage): PageDto {
  return removeUndefined({
    documentId: page.documentId,
    title: page.title ?? undefined,
    description: page.description ?? undefined,
    slug: page.slug ?? undefined,
    template: page.template ?? undefined,
    workflowState: page.workflowState ?? undefined,
    publishDate: page.publishDate ?? undefined,
    sections: Array.isArray(page.sections)
      ? page.sections.map((section) => sanitizePublicValue(section))
      : [],
  });
}
