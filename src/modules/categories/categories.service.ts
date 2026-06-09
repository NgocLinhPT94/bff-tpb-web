import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import { mapCategories, mapCategory, type CmsCategory, type CmsCategoryListItem } from './categories.mapper';
import type { CategoryDto } from './categories.dto';
import type { CmsListResponse, CmsSingleResponse } from '../../common/utils/cms-mapper';

interface CategoryListResult {
  data: CategoryDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<CategoryListResult> {
    const response = await this.cmsClient.get<
      CmsListResponse<CmsCategoryListItem>
    >('/categories', {
      params: {
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
      },
    });

    return {
      data: mapCategories(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<CategoryDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsCategory>
    >(`/categories/${documentId}`);

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapCategory(response.data);
  }
}
