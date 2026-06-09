import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import type {
  CmsListResponse,
  CmsSingleResponse,
} from '../../common/utils/cms-mapper';
import {
  mapProductCategory,
  mapProductCategories,
  type CmsProductCategory,
  type CmsProductCategoryListItem,
} from './product-categories.mapper';
import type { ProductCategoryDto } from './product-categories.dto';

const POPULATE_PARAMS = {
  'populate[icon]': true,
  'populate[bannerImage]': true,
  'populate[seo][populate]': '*',
  'populate[ProductCategory]': true,
  'populate[promotions]': true,
} as const;

interface ProductCategoryListResult {
  data: ProductCategoryDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<ProductCategoryListResult> {
    const response = await this.cmsClient.get<
      CmsListResponse<CmsProductCategoryListItem>
    >('/product-categories', {
      params: {
        ...POPULATE_PARAMS,
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
      },
    });

    return {
      data: mapProductCategories(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<ProductCategoryDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsProductCategory>
    >(`/product-categories/${documentId}`, {
      params: POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapProductCategory(response.data);
  }
}
