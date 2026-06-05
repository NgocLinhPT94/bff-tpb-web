import {
  mapMedia,
  removeUndefined,
  type MediaSummaryDto,
  type StrapiMediaInput,
} from '../shared/strapi-mapper';
import type {
  CmsNavigation,
  CmsNavigationItem,
} from '../../infrastructure/strapi/cms-types';

type NavigationItemSummaryInput = Pick<CmsNavigationItem, 'documentId'> &
  Partial<
    Pick<CmsNavigationItem, 'id' | 'name' | 'title' | 'url' | 'order'>
  > & {
    icon?: StrapiMediaInput | null;
  };

type NavigationLinkInput = Partial<
  Omit<NonNullable<CmsNavigation['iconshare']>[number], 'icon'>
> & { icon?: StrapiMediaInput | null };

type NavigationButtonInput = Partial<
  NonNullable<CmsNavigation['ButtonShare']>[number]
>;

export type NavigationMapperInput = Pick<CmsNavigation, 'documentId'> &
  Partial<Pick<CmsNavigation, 'name' | 'type_menu' | 'on_off'>> & {
    navigation_items?: NavigationItemSummaryInput[] | null;
    iconshare?: NavigationLinkInput[] | null;
    ButtonShare?: NavigationButtonInput[] | null;
  };

export interface NavigationItemSummaryDto {
  documentId: string;
  name?: string;
  title?: string;
  url?: string;
  order?: number;
  icon?: MediaSummaryDto;
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
}

export interface NavigationDto {
  documentId: string;
  name?: string;
  type_menu?: string;
  on_off?: boolean | null;
  navigation_items: NavigationItemSummaryDto[];
  iconshare: LinkDto[];
  ButtonShare: ButtonDto[];
}

export function mapNavigation(
  navigation: NavigationMapperInput,
): NavigationDto {
  return removeUndefined({
    documentId: navigation.documentId,
    name: navigation.name ?? undefined,
    type_menu: navigation.type_menu ?? undefined,
    on_off: navigation.on_off,
    navigation_items: mapNavigationItemSummaries(navigation.navigation_items),
    iconshare: mapLinks(navigation.iconshare),
    ButtonShare: mapButtons(navigation.ButtonShare),
  });
}

function mapNavigationItemSummaries(
  items: NavigationItemSummaryInput[] | null | undefined,
): NavigationItemSummaryDto[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) =>
    removeUndefined({
      documentId: item.documentId,
      name: item.name ?? undefined,
      title: item.title ?? undefined,
      url: item.url ?? undefined,
      order: item.order ?? undefined,
      icon: mapMedia(item.icon),
    }),
  );
}

function mapLinks(links: NavigationLinkInput[] | null | undefined): LinkDto[] {
  if (!links?.length) {
    return [];
  }

  return links.map((link) =>
    removeUndefined({
      label: link.label ?? undefined,
      url: link.url ?? undefined,
      external: link.external,
      order: link.order ?? undefined,
      icon: mapMedia(link.icon),
    }),
  );
}

function mapButtons(
  buttons: NavigationButtonInput[] | null | undefined,
): ButtonDto[] {
  if (!buttons?.length) {
    return [];
  }

  return buttons.map((button) =>
    removeUndefined({
      label: button.label ?? undefined,
      url: button.url ?? undefined,
      style: button.style ?? undefined,
    }),
  );
}
