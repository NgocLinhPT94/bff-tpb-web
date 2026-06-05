import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import type { CmsAuthor } from '../../infrastructure/strapi/cms-types';
import { StrapiClient } from '../../infrastructure/strapi/strapi.client';
import { mapAuthor, mapAuthors, type AuthorDto } from './authors.mapper';
import type {
  StrapiListResponse,
  StrapiSingleResponse,
} from '../shared/strapi-mapper';

const AUTHORS_POPULATE_PARAMS = {
  'populate[avatar]': true,
} as const;

interface AuthorListResult {
  data: AuthorDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class AuthorsService {
  constructor(private readonly strapiClient: StrapiClient) {}

  async findAll(query: ListQueryDto): Promise<AuthorListResult> {
    const response = await this.strapiClient.get<StrapiListResponse<CmsAuthor>>(
      '/authors',
      {
        params: {
          'pagination[page]': query.page,
          'pagination[pageSize]': query.pageSize,
          sort: query.sort,
          ...AUTHORS_POPULATE_PARAMS,
        },
      },
    );

    return {
      data: mapAuthors(response.data),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<AuthorDto> {
    const response = await this.strapiClient.get<
      StrapiSingleResponse<CmsAuthor>
    >(`/authors/${documentId}`, {
      params: AUTHORS_POPULATE_PARAMS,
    });

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapAuthor(response.data);
  }
}
