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
  mapNavigation,
  type NavigationDto,
  type StrapiNavigation,
} from './navigation.mapper';

const NAVIGATION_POPULATE = [
  'navigation_items.icon',
  'iconshare.icon',
  'ButtonShare',
] as const;

@Injectable()
export class NavigationService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(
    query: ListQueryDto,
  ): Promise<StrapiCollectionResponse<NavigationDto>> {
    const response = await this.strapiClient.get<
      StrapiCollectionResponse<StrapiNavigation>
    >('/navigations', {
      params: buildStrapiListParams(query, NAVIGATION_POPULATE),
    });

    return {
      data: response.data.map((navigation) => mapNavigation(navigation)),
      meta: response.meta,
    };
  }

  async findOne(documentId: string): Promise<NavigationDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<StrapiNavigation>
    >(`/navigations/${documentId}`, {
      params: buildPopulateParams(NAVIGATION_POPULATE),
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapNavigation(response.data);
  }
}
