import type { MediaSummaryDto } from '../../common/utils/cms-mapper';

export interface AuthorDto {
  documentId: string;
  name: string;
  email?: string;
  title?: string;
  bio?: string;
  avatar?: MediaSummaryDto | null;
}
