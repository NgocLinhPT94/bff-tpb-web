import { Injectable, NotFoundException } from '@nestjs/common';
import type { CmsGlobal } from '../../infrastructure/strapi/cms-types';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import { buildPopulateParams } from '../shared/list-query';
import type { StrapiSingleResponse } from '../shared/strapi-mapper';
import { mapGlobal, type GlobalDto } from './global.mapper';

const GLOBAL_POPULATE = ['favicon', 'defaultSeo', 'logo'] as const;

@Injectable()
export class GlobalService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findOne(): Promise<GlobalDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<CmsGlobal>
    >('/global', {
      params: buildPopulateParams(GLOBAL_POPULATE),
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapGlobal(response.data);
  }
}
