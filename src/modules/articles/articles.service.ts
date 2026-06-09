import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import { mapArticle, mapArticles, type CmsArticle, type CmsArticleListItem } from './articles.mapper';
import type { ArticleDto } from './articles.dto';
import type { CmsListResponse, CmsSingleResponse } from '../../common/utils/cms-mapper';

const ARTICLES_POPULATE_PARAMS = {
  'populate[cover]': true,
  'populate[thumbnail]': true,
  'populate[attachments]': true,
  'populate[tags]': true,
  'populate[author][populate]': 'avatar',
  'populate[category]': true,
  'populate[blocks][populate]': '*',
  'populate[seo][populate]': '*',
  'populate[relatedProducts]': true,
  'populate[relatedArticles][populate]': 'cover',
} as const;

interface ArticleListResult {
  data: ArticleDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class ArticlesService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto, isDraft = false): Promise<ArticleListResult> {
    const response = await this.cmsClient.get<
      CmsListResponse<CmsArticleListItem>
    >('/articles', {
      params: {
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
        ...ARTICLES_POPULATE_PARAMS,
      },
      isDraft,
    });

    return {
      data: mapArticles(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string, isDraft = false): Promise<ArticleDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsArticle>
    >(`/articles/${documentId}`, {
      params: ARTICLES_POPULATE_PARAMS,
      isDraft,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapArticle(response.data);
  }
}
