import { Injectable, NotFoundException } from '@nestjs/common';
import { CmsClient } from '../../integrations/cms/cms.client';
import type { CmsSingleResponse } from '../../common/utils/cms-mapper';
import { mapAbout, type CmsAbout } from './about.mapper';
import type { AboutDto } from './about.dto';

const ABOUT_POPULATE = 'blocks';

@Injectable()
export class AboutService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findOne(): Promise<AboutDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsAbout>
    >('/about', {
      params: { populate: ABOUT_POPULATE },
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapAbout(response.data);
  }
}
