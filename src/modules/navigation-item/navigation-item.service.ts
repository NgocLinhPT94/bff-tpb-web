import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import {
  buildPopulateParams,
  buildCmsListParams,
} from '../../common/utils/list-query';
import type {
  CmsCollectionResponse,
  CmsSingleResponse,
} from '../../common/utils/cms-mapper';
import {
  mapNavigationItem,
  type CmsNavigationItem,
} from './navigation-item.mapper';
import type { NavigationItemDto } from './navigation-item.dto';

const NAVIGATION_ITEM_POPULATE = [
  'icon',
  'navigations',
  'parent',
  'children',
  'children.icon',
  'children.children',
  'children.children.icon',
] as const;

interface NavigationItemListResult {
  data: NavigationItemDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class NavigationItemService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<NavigationItemListResult> {
    const response = await this.cmsClient.get<
      CmsCollectionResponse<CmsNavigationItem>
    >('/navigation-items', {
      params: buildCmsListParams(query, NAVIGATION_ITEM_POPULATE),
    });

    return {
      data: response.data.map((item) => mapNavigationItem(item)),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<NavigationItemDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsNavigationItem>
    >(`/navigation-items/${documentId}`, {
      params: buildPopulateParams(NAVIGATION_ITEM_POPULATE),
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapNavigationItem(response.data);
  }
}
