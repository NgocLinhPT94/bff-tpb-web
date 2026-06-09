import type { MediaSummaryDto } from '../../common/utils/cms-mapper';

export type NavigationMenuType = 'header' | 'footer' | 'mobile' | 'h-khcc' | 'f-khcc';

export interface NavigationItemSummaryDto {
  documentId: string;
  name?: string;
  title?: string;
  url?: string;
  order?: number;
  icon?: MediaSummaryDto;
  children?: NavigationItemSummaryDto[];
}

export interface LinkDto {
  label?: string;
  url?: string;
  external?: boolean | null;
  order?: number;
  icon?: MediaSummaryDto;
}

export interface ButtonDto {
  label?: string;
  url?: string;
  style?: string;
  order?: number;
}

export interface NavigationDto {
  documentId: string;
  name: string;
  type_menu: NavigationMenuType;
  on_off?: boolean | null;
  navigation_items: NavigationItemSummaryDto[];
  iconshare: LinkDto[];
  ButtonShare: ButtonDto[];
}
