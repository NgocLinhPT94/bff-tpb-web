import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import { mapFaq, mapFaqs, type CmsFaq, type CmsFaqListItem } from './faqs.mapper';
import type { FaqDto } from './faqs.dto';
import type {
  CmsCollectionResponse,
  CmsSingleResponse,
} from '../../common/utils/cms-mapper';

const FAQS_POPULATE_PARAMS = {
  'populate[category]': true,
  'populate[product][populate]': 'thumbnail',
} as const;

interface FaqListResult {
  data: FaqDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class FaqsService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<FaqListResult> {
    const response = await this.cmsClient.get<
      CmsCollectionResponse<CmsFaqListItem>
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
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<FaqDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsFaq>
    >(`/faqs/${documentId}`, {
      params: FAQS_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapFaq(response.data);
  }
}
