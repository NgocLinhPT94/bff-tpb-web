import {
  type CmsOperationData,
  mapMedia,
  mapRelationSummary,
  mapRelationSummaries,
  removeUndefined,
} from '../../common/utils/cms-mapper';
import type { NavigationItemDto } from './navigation-item.dto';

export type CmsNavigationItem = CmsOperationData<'navigation-item/get/navigation_items_by_id'>;

export const NAVIGATION_ITEM_MAX_CHILD_DEPTH = 5;

export function mapNavigationItem(
  item: CmsNavigationItem,
): NavigationItemDto {
  return mapNavigationItemAtDepth(item, 0, new Set<string>());
}

function mapNavigationItemAtDepth(
  item: CmsNavigationItem,
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
    navigations: mapRelationSummaries(item.navigations),
    parent: mapRelationSummary(item.parent),
    children: mapChildren(item.children, depth, nextAncestors),
  });
}

function mapChildren(
  children: CmsNavigationItem[] | null | undefined,
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
