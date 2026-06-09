import type { MediaSummaryDto, RelationSummaryDto } from '../../common/utils/cms-mapper';
import type { TagDto } from '../tags/tags.dto';

export enum ProductType {
  ACCOUNT = 'account',
  CREDIT_CARD = 'credit_card',
  LOAN = 'loan',
  SAVING = 'saving',
  INSURANCE = 'insurance',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMING_SOON = 'coming_soon',
}

export enum CustomerSegment {
  INDIVIDUAL = 'individual',
  CORPORATE = 'corporate',
  PRIORITY = 'priority',
}

export enum TargetAudience {
  CA_NHAN = 'Cá nhân',
  DOANH_NGHIEP = 'Doanh nghiệp',
  SME = 'SME',
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
  name: string;
  slug: string;
  productType?: ProductType;
  statusProduct?: ProductStatus;
  customerSegment?: CustomerSegment;
  targetAudience?: TargetAudience;
  shortDescription?: string;
  description?: unknown[];
  thumbnail?: MediaSummaryDto;
  mainBanner?: MediaSummaryDto;
  coverImage?: MediaSummaryDto;
  images?: MediaSummaryDto[];
  documents?: MediaSummaryDto[];
  seo?: unknown;
  tags?: TagDto[];
  features?: unknown[];
  benefits?: unknown[];
  sortOrder?: number;
  interestRateMin?: number;
  interestRateMax?: number;
  loanAmountMin?: string;
  loanAmountMax?: string;
  tenor?: string;
  applyUrl?: string;
  category?: RelationSummaryDto;
  relatedProducts?: RelationSummaryDto[];
  relatedArticles?: RelationSummaryDto[];
  applicablePromotions?: RelationSummaryDto[];
  faqs?: ProductFaqSummaryDto[];
  promotions?: ProductPromotionSummaryDto[];
}
