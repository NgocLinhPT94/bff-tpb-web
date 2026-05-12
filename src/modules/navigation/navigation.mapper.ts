import {
  mapMedia,
  removeUndefined,
  type MediaSummaryDto,
  type StrapiMediaInput,
} from '../shared/strapi-mapper';

export interface StrapiNavigation {
  documentId: string;
  name?: string | null;
  type_menu?: string | null;
  on_off?: boolean | null;
  navigation_items?: StrapiNavigationItemSummary[] | null;
  iconshare?: StrapiLink[] | null;
  ButtonShare?: StrapiButton[] | null;
}

export interface StrapiNavigationItemSummary {
  documentId: string;
  name?: string | null;
  title?: string | null;
  url?: string | null;
  order?: number | null;
  icon?: StrapiMediaInput | null;
  [key: string]: unknown;
}

export interface StrapiLink {
  label?: string | null;
  url?: string | null;
  external?: boolean | null;
  order?: number | null;
  icon?: StrapiMediaInput | null;
  [key: string]: unknown;
}

export interface StrapiButton {
  label?: string | null;
  url?: string | null;
  style?: string | null;
  [key: string]: unknown;
}

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

export function mapNavigation(navigation: StrapiNavigation): NavigationDto {
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
  items: StrapiNavigationItemSummary[] | null | undefined,
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

function mapLinks(links: StrapiLink[] | null | undefined): LinkDto[] {
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

function mapButtons(buttons: StrapiButton[] | null | undefined): ButtonDto[] {
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
