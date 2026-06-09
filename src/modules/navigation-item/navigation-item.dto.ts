import type { MediaSummaryDto, RelationSummaryDto } from '../../common/utils/cms-mapper';

export interface NavigationItemDto {
  documentId: string;
  name?: string;
  title?: string;
  url?: string;
  order?: number;
  icon?: MediaSummaryDto;
  navigations?: RelationSummaryDto[];
  parent?: RelationSummaryDto;
  children: NavigationItemDto[];
}
