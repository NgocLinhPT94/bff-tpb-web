import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import {
  mapCategories,
  mapCategory,
  type CategoryDto,
} from './categories.mapper';
import type {
  StrapiEntity,
  StrapiListResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';

interface CategoryListResult {
  data: CategoryDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(query: ListQueryDto): Promise<CategoryListResult> {
    const response = await this.strapiClient.get<
      StrapiListResponse<StrapiEntity>
    >('/categories', {
      params: {
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
      },
    });

    return {
      data: mapCategories(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<CategoryDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<StrapiEntity>
    >(`/categories/${documentId}`);

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapCategory(response.data);
  }
}
