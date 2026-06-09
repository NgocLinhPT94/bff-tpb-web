import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import { buildCmsListParams } from '../../common/utils/list-query';
import type {
  CmsCollectionResponse,
  CmsSingleResponse,
} from '../../common/utils/cms-mapper';
import { mapPage, type CmsPage, type CmsPageListItem } from './pages.mapper';
import type { PageDto } from './pages.dto';

const PAGES_LIST_POPULATE = 'sections';

// Deep populate for dynamic zone "sections" - each component populated with its nested fields
const PAGES_DETAIL_POPULATE = {
  // blocks.banners-main → banners (repeatable component) → all nested fields
  'populate[sections][on][blocks.banners-main][populate][banners][populate][background]': 'true',
  'populate[sections][on][blocks.banners-main][populate][banners][populate][buttons][populate]':'*',
  'populate[sections][on][blocks.banners-main][populate][banners][populate][theme][populate]':'*',

  // blocks.feature-grid → items (component), link (component), background (media), themeOptions (component)
  'populate[sections][on][blocks.feature-grid][populate][items][populate]': '*',
  'populate[sections][on][blocks.feature-grid][populate][link][populate]': '*',
  'populate[sections][on][blocks.feature-grid][populate][background]': 'true',
  'populate[sections][on][blocks.feature-grid][populate][themeOptions][populate]':
    '*',

  // Other components - populate everything
  'populate[sections][on][blocks.rich-text][populate]': '*',
  'populate[sections][on][blocks.product-highlight][populate]': '*',
  'populate[sections][on][blocks.news-block][populate]': '*',
  'populate[sections][on][blocks.faq-block][populate]': '*',
  'populate[sections][on][blocks.cta-banner][populate]': '*',
  'populate[sections][on][shared.slider][populate]': '*',
} as const;

interface PageListResult {
  data: PageDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class PagesService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(
    query: ListQueryDto,
    isDraft = false,
  ): Promise<PageListResult> {
    const response = await this.cmsClient.get<
      CmsCollectionResponse<CmsPageListItem>
    >('/pages', {
      params: buildCmsListParams(query, PAGES_LIST_POPULATE),
      isDraft,
    });

    return {
      data: response.data.map((page) => mapPage(page)),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string, isDraft = false): Promise<PageDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsPage>
    >(`/pages/${documentId}`, {
      params: PAGES_DETAIL_POPULATE,
      isDraft,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapPage(response.data);
  }
}
