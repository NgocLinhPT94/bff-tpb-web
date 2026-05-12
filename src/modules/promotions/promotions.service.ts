import { Injectable, NotFoundException } from '@nestjs/common';
import { ListQueryDto } from '../../common/query';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import type {
  StrapiListResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';
import type { PromotionDto } from './promotions.dto';
import {
  mapPromotion,
  mapPromotions,
  type PromotionStrapiEntity,
} from './promotions.mapper';

const PROMOTION_POPULATE_PARAMS = {
  'populate[0]': 'products',
  'populate[1]': 'banner',
} as const;

@Injectable()
export class PromotionsService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(
    query: ListQueryDto,
  ): Promise<StrapiListResponse<PromotionDto>> {
    const response = await this.strapiClient.get<
      StrapiListResponse<PromotionStrapiEntity>
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
      meta: response.meta,
    };
  }

  async findOne(documentId: string): Promise<PromotionDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<PromotionStrapiEntity>
    >(`/promotions/${documentId}`, {
      params: PROMOTION_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapPromotion(response.data);
  }
}
