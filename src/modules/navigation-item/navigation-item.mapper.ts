import {
  mapMedia,
  removeUndefined,
  type MediaSummaryDto,
  type RelationSummaryDto,
  type StrapiMediaInput,
} from '../shared/strapi-mapper';
import type {
  CmsNavigation,
  CmsNavigationItem,
} from '../../infrastructure/strapi/cms-types';

export const NAVIGATION_ITEM_MAX_CHILD_DEPTH = 5;

type RelationSummaryInput = Pick<CmsNavigationItem, 'documentId'> &
  Partial<Pick<CmsNavigationItem, 'id' | 'name' | 'title' | 'url' | 'order'>> &
  Partial<Pick<CmsNavigation, 'type_menu'>> & {
    navigation_items?: Array<Partial<CmsNavigationItem>> | null;
    children?: NavigationItemMapperInput[] | null;
  };

export type NavigationItemMapperInput = Pick<CmsNavigationItem, 'documentId'> &
  Partial<
    Pick<CmsNavigationItem, 'id' | 'name' | 'title' | 'url' | 'order'>
  > & {
    icon?: StrapiMediaInput | null;
    navigation?: RelationSummaryInput | null;
    parent?: NavigationItemMapperInput | null;
    children?: NavigationItemMapperInput[] | null;
  };

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
  item: NavigationItemMapperInput,
): NavigationItemDto {
  return mapNavigationItemAtDepth(item, 0, new Set<string>());
}

function mapNavigationItemAtDepth(
  item: NavigationItemMapperInput,
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
    navigation: mapRelationSummaryInput(item.navigation),
    parent: mapRelationSummaryInput(item.parent),
    children: mapChildren(item.children, depth, nextAncestors),
  });
}

function mapChildren(
  children: NavigationItemMapperInput[] | null | undefined,
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

function mapRelationSummaryInput(
  relation: RelationSummaryInput | null | undefined,
): RelationSummaryDto | undefined {
  if (!relation) {
    return undefined;
  }

  return removeUndefined({
    documentId: relation.documentId,
    name: relation.name ?? undefined,
    title: relation.title ?? undefined,
    url: relation.url ?? undefined,
    order: relation.order ?? undefined,
    type_menu: relation.type_menu ?? undefined,
  });
}
