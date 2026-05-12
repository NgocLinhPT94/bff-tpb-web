import {
  mapMedia,
  removeUndefined,
  sanitizePublicValue,
  type MediaSummaryDto,
  type StrapiMediaInput,
} from '../shared/strapi-mapper';

export interface StrapiGlobal {
  documentId: string;
  siteName: string;
  siteDescription: string;
  hotline?: string | null;
  email?: string | null;
  address?: string | null;
  analytics_script?: unknown[] | null;
  favicon?: StrapiMediaInput | null;
  logo?: StrapiMediaInput | null;
  defaultSeo?: StrapiSeo | null;
}

export interface StrapiSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  shareImage?: StrapiMediaInput | null;
  [key: string]: unknown;
}

export interface SeoDto {
  metaTitle?: string;
  metaDescription?: string;
  shareImage?: MediaSummaryDto;
}

export interface GlobalDto {
  documentId: string;
  siteName: string;
  siteDescription: string;
  hotline?: string;
  email?: string;
  address?: string;
  analytics_script?: unknown[];
  favicon?: MediaSummaryDto;
  logo?: MediaSummaryDto;
  defaultSeo?: SeoDto;
}

export function mapGlobal(global: StrapiGlobal): GlobalDto {
  return removeUndefined({
    documentId: global.documentId,
    siteName: global.siteName,
    siteDescription: global.siteDescription,
    hotline: global.hotline ?? undefined,
    email: global.email ?? undefined,
    address: global.address ?? undefined,
    analytics_script: Array.isArray(global.analytics_script)
      ? global.analytics_script.map((block) => sanitizePublicValue(block))
      : undefined,
    favicon: mapMedia(global.favicon),
    logo: mapMedia(global.logo),
    defaultSeo: mapSeo(global.defaultSeo),
  });
}

function mapSeo(seo: StrapiSeo | null | undefined): SeoDto | undefined {
  if (!seo) {
    return undefined;
  }

  return removeUndefined({
    metaTitle: seo.metaTitle ?? undefined,
    metaDescription: seo.metaDescription ?? undefined,
    shareImage: mapMedia(seo.shareImage),
  });
}
