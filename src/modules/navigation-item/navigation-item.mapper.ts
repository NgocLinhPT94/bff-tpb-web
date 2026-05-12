import {
  mapMedia,
  mapRelationSummary,
  removeUndefined,
  type MediaSummaryDto,
  type RelationSummaryDto,
  type StrapiMediaInput,
} from '../shared/strapi-mapper';

export const NAVIGATION_ITEM_MAX_CHILD_DEPTH = 5;

export interface StrapiNavigationItem {
  documentId: string;
  name?: string | null;
  title?: string | null;
  url?: string | null;
  order?: number | null;
  icon?: StrapiMediaInput | null;
  navigation?: Record<string, unknown> | null;
  parent?: Record<string, unknown> | null;
  children?: StrapiNavigationItem[] | null;
}

export interface NavigationItemDto {
  documentId: string;
  name?: string;
  title?: string;
  url?: string;
  order?: number;
  icon?: MediaSummaryDto;
  navigation?: RelationSummaryDto;
  parent?: RelationSummaryDto;
  children: NavigationItemDto[];
}

export function mapNavigationItem(
  item: StrapiNavigationItem,
): NavigationItemDto {
  return mapNavigationItemAtDepth(item, 0, new Set<string>());
}

function mapNavigationItemAtDepth(
  item: StrapiNavigationItem,
  depth: number,
  ancestors: Set<string>,
): NavigationItemDto {
  const nextAncestors = new Set(ancestors);
  nextAncestors.add(item.documentId);

  return removeUndefined({
    documentId: item.documentId,
    name: item.name ?? undefined,
    title: item.title ?? undefined,
    url: item.url ?? undefined,
    order: item.order ?? undefined,
    icon: mapMedia(item.icon),
    navigation: mapRelationSummary(item.navigation),
    parent: mapRelationSummary(item.parent),
    children: mapChildren(item.children, depth, nextAncestors),
  });
}

function mapChildren(
  children: StrapiNavigationItem[] | null | undefined,
  depth: number,
  ancestors: Set<string>,
): NavigationItemDto[] {
  if (!children?.length || depth >= NAVIGATION_ITEM_MAX_CHILD_DEPTH) {
    return [];
  }

  return children.flatMap((child) => {
    if (ancestors.has(child.documentId)) {
      return [];
    }

    return [mapNavigationItemAtDepth(child, depth + 1, ancestors)];
  });
}
