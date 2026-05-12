import { SuccessEnvelopeDto } from '../../common/dto';
import type { PaginationMeta, RequestMetaDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import type { StrapiListResponse } from './strapi-mapper';

export function buildRequestMeta(request: RequestWithId): RequestMetaDto {
  return { requestId: request.requestId ?? '' };
}

export function buildListMeta<T>(
  request: RequestWithId,
  response: StrapiListResponse<T>,
): RequestMetaDto {
  return {
    requestId: request.requestId ?? '',
    pagination: response.meta?.pagination,
  };
}

export function createSuccessEnvelope<T>(
  request: RequestWithId,
  data: T,
  pagination?: PaginationMeta,
): SuccessEnvelopeDto<T> {
  const meta: RequestMetaDto = {
    requestId: request.requestId ?? '',
  };

  if (pagination !== undefined) {
    meta.pagination = pagination;
  }

  return new SuccessEnvelopeDto(data, meta);
}
