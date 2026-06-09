import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import { mapAuthor, mapAuthors, type CmsAuthor, type CmsAuthorListItem } from './authors.mapper';
import type { AuthorDto } from './authors.dto';
import type { CmsListResponse, CmsSingleResponse } from '../../common/utils/cms-mapper';

const AUTHORS_POPULATE_PARAMS = {
  'populate[avatar]': true,
} as const;

interface AuthorListResult {
  data: AuthorDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class AuthorsService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<AuthorListResult> {
    const response = await this.cmsClient.get<
      CmsListResponse<CmsAuthorListItem>
    >('/authors', {
      params: {
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
        ...AUTHORS_POPULATE_PARAMS,
      },
    });

    return {
      data: mapAuthors(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<AuthorDto> {
    const response = await this.cmsClient.get<
      CmsSingleResponse<CmsAuthor>
    >(`/authors/${documentId}`, {
      params: AUTHORS_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapAuthor(response.data);
  }
}
