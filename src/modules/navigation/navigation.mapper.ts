import type { components, operations } from '../../integrations/cms/generated/cms-schema.d.ts';
import {
  mapMedia,
  removeUndefined,
} from '../../common/utils/cms-mapper';
import type {
  NavigationDto,
  NavigationItemSummaryDto,
  NavigationMenuType,
  LinkDto,
  ButtonDto,
} from './navigation.dto';

export type CmsNavigation =
  operations['navigation/get/navigations_by_id']['responses'][200]['content']['application/json']['data'];

type CmsNavigationItem = components['schemas']['ApiNavigationItemNavigationItemDocument'] & {
  children?: CmsNavigationItem[] | null;
};
type CmsLink = components['schemas']['SharedLinkEntry'];
type CmsButton = components['schemas']['SharedButtonEntry'];

export function mapNavigation(navigation: CmsNavigation): NavigationDto {
  return removeUndefined({
    documentId: navigation.documentId,
    name: navigation.name,
    type_menu: navigation.type_menu as NavigationMenuType,
    on_off: navigation.on_off,
    navigation_items: mapNavigationItems(navigation.navigation_items),
    iconshare: mapLinks(navigation.iconshare),
    ButtonShare: mapButtons(navigation.ButtonShare),
  });
}

function mapNavigationItems(
  items: CmsNavigationItem[] | null | undefined,
): NavigationItemSummaryDto[] {
  if (!items?.length) return [];

  return items.map((item) =>
    removeUndefined({
      documentId: item.documentId,
      name: item.name ?? undefined,
      title: item.title ?? undefined,
      url: item.url ?? undefined,
      order: item.order ?? undefined,
      icon: mapMedia(item.icon),
      children: item.children?.length
        ? mapNavigationItems(item.children)
        : undefined,
    }),
  );
}

function mapLinks(links: CmsLink[] | null | undefined): LinkDto[] {
  if (!links?.length) return [];

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

function mapButtons(buttons: CmsButton[] | null | undefined): ButtonDto[] {
  if (!buttons?.length) return [];

  return buttons.map((button) =>
    removeUndefined({
      label: button.label ?? undefined,
      url: button.url ?? undefined,
      style: button.style ?? undefined,
      order: button.order ?? undefined,
    }),
  );
}
