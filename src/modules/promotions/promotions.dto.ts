import type { MediaSummaryDto, RelationSummaryDto } from '../../common/utils/cms-mapper';
import type { TagDto } from '../tags/tags.dto';

export type PromotionCustomerSegment = 'individual' | 'corporate' | 'priority' | 'all';
export type PromotionApplicableCard = 'Visa' | 'Mastercard' | 'JCB';
export type PromotionTargetAudience = 'Cá nhân' | 'Doanh nghiệp' | 'Tất cả';

export interface PromotionProductSummaryDto {
  documentId: string;
  name?: string;
  slug?: string;
}

export interface PromotionDto {
  documentId: string;
  title: string;
  slug: string;
  shortDescription?: string;
  content?: unknown[];
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaLink?: string;
  ctaUrl?: string;
  customerSegment?: PromotionCustomerSegment;
  applicableCards?: PromotionApplicableCard;
  targetAudience?: PromotionTargetAudience;
  tags?: TagDto[];
  priority?: boolean;
  isFeatured?: boolean;
  displayLocations?: unknown;
  termsConditions?: unknown[];
  seo?: unknown;
  publishedDate?: string;
  banner?: MediaSummaryDto[];
  products?: PromotionProductSummaryDto[];
  applicableProducts?: PromotionProductSummaryDto[];
  categories?: RelationSummaryDto[];
}
