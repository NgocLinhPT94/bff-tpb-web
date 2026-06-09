import { Injectable, NotFoundException } from '@nestjs/common';
import { CmsClient } from '../../integrations/cms/cms.client';
import { buildPopulateParams } from '../../common/utils/list-query';
import type { CmsSingleResponse } from '../../common/utils/cms-mapper';
import { mapGlobal, type CmsGlobal } from './global.mapper';
import type { GlobalDto } from './global.dto';

const GLOBAL_POPULATE = ['favicon', 'defaultSeo', 'logo'] as const;

@Injectable()
export class GlobalService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findOne(): Promise<GlobalDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsGlobal>
    >('/global', {
      params: buildPopulateParams(GLOBAL_POPULATE),
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapGlobal(response.data);
  }
}
