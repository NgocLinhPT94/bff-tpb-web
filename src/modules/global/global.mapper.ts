import type { components } from '../../integrations/cms/generated/cms-schema.d.ts';
import {
  type CmsOperationData,
  mapMedia,
  removeUndefined,
  sanitizePublicValue,
} from '../../common/utils/cms-mapper';
import type { GlobalDto, SeoDto } from './global.dto';

export type CmsGlobal = CmsOperationData<'global/get/global'>;

type CmsSeo = components['schemas']['SharedSeoEntry'];

export function mapGlobal(global: CmsGlobal): GlobalDto {
  return removeUndefined({
    documentId: global.documentId,
    siteName: global.siteName,
    siteDescription: global.siteDescription,
    hotline: global.hotline ?? undefined,
    email: global.email ?? undefined,
    address: global.address ?? undefined,
    analytics_script: Array.isArray(global.analytics_script)
      ? global.analytics_script.map(sanitizePublicValue)
      : undefined,
    favicon: mapMedia(global.favicon),
    logo: mapMedia(global.logo),
    defaultSeo: mapSeo(global.defaultSeo),
  });
}

function mapSeo(seo: CmsSeo | null | undefined): SeoDto | undefined {
  if (!seo) return undefined;

  return removeUndefined({
    metaTitle: seo.metaTitle ?? undefined,
    metaDescription: seo.metaDescription ?? undefined,
    shareImage: mapMedia(seo.shareImage),
  });
}
