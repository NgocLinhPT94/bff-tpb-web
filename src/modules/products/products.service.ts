import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import type {
  CmsListResponse,
  CmsSingleResponse,
} from '../../common/utils/cms-mapper';
import {
  mapProduct,
  mapProducts,
  type ProductCmsEntity,
} from './products.mapper';
import type { ProductDto } from './products.dto';

const PRODUCT_POPULATE_PARAMS = {
  'populate[thumbnail]': true,
  'populate[main_banner]': true,
  'populate[coverImage]': true,
  'populate[images]': true,
  'populate[documents]': true,
  'populate[seo][populate]': '*',
  'populate[tags]': true,
  'populate[category]': true,
  'populate[relatedProducts]': true,
  'populate[relatedArticles]': true,
  'populate[applicablePromotions]': true,
  'populate[faqs]': true,
  'populate[promotions]': true,
} as const;

interface ProductListResult {
  data: ProductDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class ProductsService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<ProductListResult> {
    const response = await this.cmsClient.get<
      CmsListResponse<ProductCmsEntity>
    >('/products', {
      params: {
        ...PRODUCT_POPULATE_PARAMS,
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
      },
    });

    return {
      data: mapProducts(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<ProductDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<ProductCmsEntity>
    >(`/products/${documentId}`, {
      params: PRODUCT_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapProduct(response.data);
  }
}
