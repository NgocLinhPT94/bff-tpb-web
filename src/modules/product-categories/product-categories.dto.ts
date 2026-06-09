import type { MediaSummaryDto, RelationSummaryDto } from '../../common/utils/cms-mapper';

export interface ProductCategoryDto {
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: MediaSummaryDto;
  bannerImage?: MediaSummaryDto[];
  sortOrder?: number;
  isActive?: boolean;
  seo?: unknown;
  publishedDate?: string;
  products?: RelationSummaryDto[];
  promotions?: RelationSummaryDto[];
}
