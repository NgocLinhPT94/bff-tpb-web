import type { MediaSummaryDto } from '../../common/utils/cms-mapper';
import type { CategoryDto } from '../categories/categories.dto';

export interface ProductSummaryDto {
  documentId?: string;
  name?: string;
  slug?: string;
  product_type?: string;
  short_description?: string;
  thumbnail?: MediaSummaryDto | null;
}

export interface FaqDto {
  documentId: string;
  question?: string;
  answer?: unknown[];
  slug?: string;
  active?: boolean;
  sortOrder?: number;
  category?: CategoryDto | null;
  product?: ProductSummaryDto | null;
}
