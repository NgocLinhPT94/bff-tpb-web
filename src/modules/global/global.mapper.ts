import type { CmsGlobal, CmsSeo } from '../../infrastructure/strapi/cms-types';
import {
  mapMedia,
  removeUndefined,
  sanitizePublicValue,
  type MediaSummaryDto,
} from '../shared/strapi-mapper';

type GlobalMapperInput = Omit<
  CmsGlobal,
  'analytics_script' | 'defaultSeo' | 'favicon' | 'logo'
> & {
  analytics_script?: CmsGlobal['analytics_script'] | null;
  defaultSeo?: SeoMapperInput | null;
  favicon?: CmsGlobal['favicon'] | null;
  logo?: CmsGlobal['logo'] | null;
};

type SeoMapperInput = Omit<CmsSeo, 'shareImage'> & {
  shareImage?: CmsSeo['shareImage'] | null;
};

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

export function mapGlobal(global: GlobalMapperInput): GlobalDto {
  return removeUndefined({
    documentId: global.documentId,
    siteName: global.siteName ?? '',
    siteDescription: global.siteDescription ?? '',
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

function mapSeo(seo: SeoMapperInput | null | undefined): SeoDto | undefined {
  if (!seo) {
    return undefined;
  }

  return removeUndefined({
    metaTitle: seo.metaTitle ?? undefined,
    metaDescription: seo.metaDescription ?? undefined,
    shareImage: mapMedia(seo.shareImage),
  });
}
