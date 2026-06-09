import { SuccessEnvelopeDto } from '../dto/success-envelope.dto';
import type { PaginationMeta, RequestMetaDto } from '../dto/request-meta.dto';
import type { RequestWithId } from '../http/request-with-id';
import type { CmsListResponse } from './cms-mapper';

/**
 * Helper to create a standardized success envelope response.
 * Includes requestId from the request and optional pagination metadata.
 */
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

export function buildRequestMeta(request: RequestWithId): RequestMetaDto {
  return { requestId: request.requestId ?? '' };
}

export function buildListMeta<T>(
  request: RequestWithId,
  response: CmsListResponse<T>,
): RequestMetaDto {
  const meta: RequestMetaDto = {
    requestId: request.requestId ?? '',
  };
  if (response.meta?.pagination) {
    meta.pagination = response.meta.pagination;
  }
  return meta;
}
