import type { MediaSummaryDto } from '../../common/utils/cms-mapper';

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
