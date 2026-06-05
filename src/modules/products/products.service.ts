import { Injectable, NotFoundException } from '@nestjs/common';
import { ListQueryDto } from '../../common/query';
import type { CmsProduct } from '../../infrastructure/strapi/cms-types';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import type {
  StrapiListResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';
import { mapProduct, mapProducts } from './products.mapper';
import type { ProductDto } from './products.dto';

const PRODUCT_POPULATE_PARAMS = {
  'populate[0]': 'thumbnail',
  'populate[1]': 'main_banner',
  'populate[2]': 'documents',
  'populate[3]': 'faqs',
  'populate[4]': 'promotions',
} as const;

@Injectable()
export class ProductsService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(query: ListQueryDto): Promise<StrapiListResponse<ProductDto>> {
    const response = await this.strapiClient.get<
      StrapiListResponse<CmsProduct>
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
      meta: response.meta,
    };
  }

  async findOne(documentId: string): Promise<ProductDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<CmsProduct>
    >(`/products/${documentId}`, {
      params: PRODUCT_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapProduct(response.data);
  }
}
