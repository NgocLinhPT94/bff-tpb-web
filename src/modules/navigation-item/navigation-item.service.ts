import { Injectable, NotFoundException } from '@nestjs/common';
import type { ListQueryDto } from '../../common/query';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import {
  buildPopulateParams,
  buildStrapiListParams,
} from '../shared/list-query';
import type {
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';
import {
  mapNavigationItem,
  type NavigationItemMapperInput,
  type NavigationItemDto,
} from './navigation-item.mapper';

const NAVIGATION_ITEM_POPULATE = [
  'icon',
  'navigation',
  'parent',
  'children.icon',
  'children.children.icon',
  'children.children.children.icon',
  'children.children.children.children.icon',
  'children.children.children.children.children.icon',
] as const;

@Injectable()
export class NavigationItemService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(
    query: ListQueryDto,
  ): Promise<StrapiCollectionResponse<NavigationItemDto>> {
    const response = await this.strapiClient.get<
      StrapiCollectionResponse<NavigationItemMapperInput>
    >('/navigation-items', {
      params: buildStrapiListParams(query, NAVIGATION_ITEM_POPULATE),
    });

    return {
      data: response.data.map((item) => mapNavigationItem(item)),
      meta: response.meta,
    };
  }

  async findOne(documentId: string): Promise<NavigationItemDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<NavigationItemMapperInput>
    >(`/navigation-items/${documentId}`, {
      params: buildPopulateParams(NAVIGATION_ITEM_POPULATE),
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapNavigationItem(response.data);
  }
}
