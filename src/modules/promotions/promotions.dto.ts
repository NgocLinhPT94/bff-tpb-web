import type { MediaSummaryDto } from '../shared/strapi-mapper';

export interface PromotionProductSummaryDto {
  documentId: string;
  name?: string;
  slug?: string;
}

export interface PromotionDto {
  documentId: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  content?: unknown[];
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaLink?: string;
  banner: MediaSummaryDto[];
  products: PromotionProductSummaryDto[];
}
