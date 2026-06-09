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
  mapNavigation,
  type CmsNavigation,
} from './navigation.mapper';
import type { NavigationDto } from './navigation.dto';

const NAVIGATION_POPULATE = [
  'navigation_items.icon',
  'iconshare.icon',
  'ButtonShare',
] as const;

interface NavigationListResult {
  data: NavigationDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class NavigationService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<NavigationListResult> {
    const response = await this.cmsClient.get<
      CmsCollectionResponse<CmsNavigation>
    >('/navigations', {
      params: buildCmsListParams(query, NAVIGATION_POPULATE),
    });

    return {
      data: response.data.map((navigation) => mapNavigation(navigation)),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<NavigationDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsNavigation>
    >(`/navigations/${documentId}`, {
      params: buildPopulateParams(NAVIGATION_POPULATE),
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapNavigation(response.data);
  }
}
