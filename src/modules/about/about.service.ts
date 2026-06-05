import { Injectable, NotFoundException } from '@nestjs/common';
import type { CmsAbout } from '../../infrastructure/strapi/cms-types';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import type { StrapiSingleResponse } from '../shared/strapi-mapper';
import { mapAbout, type AboutDto } from './about.mapper';

const ABOUT_POPULATE = 'blocks';

@Injectable()
export class AboutService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findOne(): Promise<AboutDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<CmsAbout>
    >('/about', {
      params: { populate: ABOUT_POPULATE },
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapAbout(response.data);
  }
}
