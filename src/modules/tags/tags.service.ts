import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationMeta } from '../../common/dto';
import type { ListQueryDto } from '../../common/query';
import { CmsClient } from '../../integrations/cms/cms.client';
import type { CmsListResponse, CmsSingleResponse } from '../../common/utils/cms-mapper';
import type { TagDto } from './tags.dto';
import { mapTag, type CmsTag, type CmsTagListItem } from './tags.mapper';

interface TagListResult {
  data: TagDto[];
  pagination?: PaginationMeta;
}

@Injectable()
export class TagsService {
  constructor(private readonly cmsClient: CmsClient) {}

  async findAll(query: ListQueryDto): Promise<TagListResult> {
    const response = await this.cmsClient.get<CmsListResponse<CmsTagListItem>>('/tags', {
      params: {
        'pagination[page]': query.page,
        'pagination[pageSize]': query.pageSize,
        sort: query.sort,
      },
    });

    return {
      data: response.data.map(mapTag),
      pagination: response.meta?.pagination,
    };
  }

  async findOne(documentId: string): Promise<TagDto> {
    const response = await this.cmsClient.get<CmsSingleResponse<CmsTag>>(
      `/tags/${documentId}`,
    );

    if (!response.data) {
      throw new NotFoundException();
    }

    return mapTag(response.data);
  }
}
