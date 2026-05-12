import type { MediaSummaryDto } from '../shared/strapi-mapper';

export enum ProductType {
  ACCOUNT = 'account',
  CREDIT_CARD = 'credit_card',
  LOAN = 'loan',
  SAVING = 'saving',
  INSURANCE = 'insurance',
}

export interface ProductFaqSummaryDto {
  documentId: string;
  question?: string;
}

export interface ProductPromotionSummaryDto {
  documentId: string;
  title?: string;
  slug?: string;
}

export interface ProductDto {
  documentId: string;
  name?: string;
  slug?: string;
  productType?: ProductType;
  shortDescription?: string;
  thumbnail?: MediaSummaryDto;
  mainBanner?: MediaSummaryDto;
  documents: MediaSummaryDto[];
  faqs: ProductFaqSummaryDto[];
  promotions: ProductPromotionSummaryDto[];
}
