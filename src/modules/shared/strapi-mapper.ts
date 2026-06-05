import type { PaginationMeta } from '../../common/dto';

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: PaginationMeta;
  };
}

export type StrapiCollectionResponse<T> = StrapiListResponse<T>;

export interface StrapiSingleResponse<T> {
  data: T;
}

export type StrapiEntity = Record<string, unknown>;

export interface StrapiMediaInput {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: unknown;
}

export interface MediaSummaryDto {
  url?: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: unknown;
}

export interface RelationSummaryDto {
  documentId: string;
  name?: string;
  title?: string;
  label?: string;
  slug?: string;
  url?: string;
  order?: number;
  type_menu?: string;
}

const INTERNAL_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'createdBy',
  'updatedBy',
  'permissions',
  'provider',
  'provider_metadata',
  'previewUrl',
  'hash',
  'ext',
  'mime',
  'size',
  'caption',
  'focalPoint',
  'related',
]);

export function isRecord(value: unknown): value is StrapiEntity {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function getNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

export function getBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

export function getArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

export function unwrapRelation(value: unknown): unknown {
  if (isRecord(value) && 'data' in value) {
    return value.data;
  }

  return value;
}

export function unwrapRelationArray(value: unknown): unknown[] {
  const relation = unwrapRelation(value);

  if (Array.isArray(relation)) {
    return relation;
  }

  if (relation === null || relation === undefined) {
    return [];
  }

  return [relation];
}

export function mapOptionalRelation<T>(
  value: unknown,
  mapper: (entity: StrapiEntity) => T,
): T | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const relation = unwrapRelation(value);

  if (relation === null) {
    return null;
  }

  if (!isRecord(relation)) {
    return undefined;
  }

  return mapper(relation);
}

export function mapRelationArray<T>(
  value: unknown,
  mapper: (entity: StrapiEntity) => T,
): T[] {
  return unwrapRelationArray(value).filter(isRecord).map(mapper);
}

export function mapMediaSummary(
  value: unknown,
): MediaSummaryDto | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const media = unwrapRelation(value);

  if (media === null) {
    return null;
  }

  if (!isRecord(media)) {
    return undefined;
  }

  return removeUndefined({
    url: getString(media.url),
    alternativeText: getString(media.alternativeText),
    width: getNumber(media.width),
    height: getNumber(media.height),
    formats: media.formats,
  });
}

export function mapMedia(
  media: StrapiMediaInput | null | undefined,
): MediaSummaryDto | undefined {
  if (!media?.url) {
    return undefined;
  }

  return removeUndefined({
    url: media.url,
    alternativeText: media.alternativeText ?? undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    formats: media.formats,
  });
}

export function mapRelationSummary(
  relation: Record<string, unknown> | null | undefined,
): RelationSummaryDto | undefined {
  if (!relation || typeof relation.documentId !== 'string') {
    return undefined;
  }

  return removeUndefined({
    documentId: relation.documentId,
    name: getString(relation.name),
    title: getString(relation.title),
    label: getString(relation.label),
    slug: getString(relation.slug),
    url: getString(relation.url),
    order: getNumber(relation.order),
    type_menu: getString(relation.type_menu),
  });
}

export function mapRelationSummaries(
  relations: Record<string, unknown>[] | null | undefined,
): RelationSummaryDto[] {
  if (!relations?.length) {
    return [];
  }

  return relations.flatMap((relation) => {
    const summary = mapRelationSummary(relation);
    return summary ? [summary] : [];
  });
}

export function mapMediaArray(value: unknown): MediaSummaryDto[] {
  const list = getArray(value);

  if (!list?.length) {
    return [];
  }

  return list.flatMap((media) => {
    const summary = mapMediaSummary(media);
    return summary ? [summary] : [];
  });
}

export function stripInternalFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripInternalFields);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.entries(value).reduce<StrapiEntity>((cleaned, [key, field]) => {
    if (!INTERNAL_FIELDS.has(key)) {
      cleaned[key] = stripInternalFields(field);
    }

    return cleaned;
  }, {});
}

export function sanitizePublicValue(value: unknown): unknown {
  return stripInternalFields(value);
}

export function removeUndefined<T extends StrapiEntity>(value: T): T {
  const result = { ...value };

  for (const key of Object.keys(result)) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }

  return result;
}
