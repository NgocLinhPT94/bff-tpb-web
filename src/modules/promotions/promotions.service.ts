import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import type {
  CmsListResponse,
  CmsSingleResponse,
} from '../../common/utils/cms-mapper';
import type { PromotionDto } from './promotions.dto';
import {
  mapPromotion,
  mapPromotions,
  type PromotionCmsEntity,
} from './promotions.mapper';

const PROMOTION_POPULATE_PARAMS = {
  'populate[banner]': true,
  'populate[tags]': true,
  'populate[products]': true,
  'populate[applicableProducts]': true,
  'populate[categories]': true,
  'populate[seo][populate]': '*',
} as const;

interface PromotionListResult {
  data: PromotionDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class PromotionsService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<PromotionListResult> {
    const response = await this.cmsClient.get<
      CmsListResponse<PromotionCmsEntity>
    >('/promotions', {
      params: {
        ...PROMOTION_POPULATE_PARAMS,
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
      },
    });

    return {
      data: mapPromotions(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<PromotionDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<PromotionCmsEntity>
    >(`/promotions/${documentId}`, {
      params: PROMOTION_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapPromotion(response.data);
  }
}
