import { Injectable, NotFoundException } from '@nestjs/common';
import type { ListQueryDto } from '../../common/query';
import type { CmsFaq } from '../../infrastructure/strapi/cms-types';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import { mapFaq, mapFaqs, type FaqDto } from './faqs.mapper';
import type {
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';

const FAQS_POPULATE_PARAMS = {
  'populate[category]': true,
  'populate[products][populate]': 'thumbnail',
} as const;

@Injectable()
export class FaqsService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(
    query: ListQueryDto,
  ): Promise<StrapiCollectionResponse<FaqDto>> {
    const response = await this.strapiClient.get<
      StrapiCollectionResponse<CmsFaq>
    >('/faqs', {
      params: {
        ...FAQS_POPULATE_PARAMS,
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
      },
    });

    return {
      data: mapFaqs(response.data),
      meta: response.meta,
    };
  }

  async findOne(documentId: string): Promise<FaqDto> {
    const response = await this.strapiClient.get<StrapiSingleResponse<CmsFaq>>(
      `/faqs/${documentId}`,
      {
        params: FAQS_POPULATE_PARAMS,
      },
    );

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapFaq(response.data);
  }
}
