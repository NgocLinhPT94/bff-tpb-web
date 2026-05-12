import { Injectable, NotFoundException } from '@nestjs/common';
import type { ListQueryDto } from '../../common/query';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import { buildStrapiListParams } from '../shared/list-query';
import type {
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';
import { mapPage, type PageDto, type StrapiPage } from './pages.mapper';

const PAGES_POPULATE = 'sections';

@Injectable()
export class PagesService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(
    query: ListQueryDto,
  ): Promise<StrapiCollectionResponse<PageDto>> {
    const response = await this.strapiClient.get<
      StrapiCollectionResponse<StrapiPage>
    >('/pages', {
      params: buildStrapiListParams(query, PAGES_POPULATE),
    });

    return {
      data: response.data.map((page) => mapPage(page)),
      meta: response.meta,
    };
  }

  async findOne(documentId: string): Promise<PageDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<StrapiPage>
    >(`/pages/${documentId}`, {
      params: { populate: PAGES_POPULATE },
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapPage(response.data);
  }
}
