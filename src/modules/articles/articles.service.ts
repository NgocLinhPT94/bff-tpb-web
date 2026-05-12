import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import { mapArticle, mapArticles, type ArticleDto } from './articles.mapper';
import type {
  StrapiEntity,
  StrapiListResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';

const ARTICLES_POPULATE_PARAMS = {
  'populate[cover]': true,
  'populate[author][populate]': 'avatar',
  'populate[category]': true,
} as const;

interface ArticleListResult {
  data: ArticleDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class ArticlesService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(query: ListQueryDto): Promise<ArticleListResult> {
    const response = await this.strapiClient.get<
      StrapiListResponse<StrapiEntity>
    >('/articles', {
      params: {
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
        ...ARTICLES_POPULATE_PARAMS,
      },
    });

    return {
      data: mapArticles(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<ArticleDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<StrapiEntity>
    >(`/articles/${documentId}`, {
      params: ARTICLES_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapArticle(response.data);
  }
}
