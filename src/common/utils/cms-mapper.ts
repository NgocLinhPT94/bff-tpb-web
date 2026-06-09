import type { PaginationMeta } from '../dto/request-meta.dto';
import type { SuccessResponseJSON } from 'openapi-typescript-helpers';
import type { operations } from '../../integrations/cms/generated/cms-schema.d.ts';

export type CmsOperationData<OperationId extends keyof operations> =
  SuccessResponseJSON<operations[OperationId]> extends { data: infer Data }
    ? Data
    : never;

export interface CmsListResponse<T> {
  data: T[];
  meta?: {
    pagination?: PaginationMeta;
  };
}

export type CmsCollectionResponse<T> = CmsListResponse<T>;

export interface CmsSingleResponse<T> {
  data: T;
}

/** @internal Used for runtime type guards and stripInternalFields accumulator */
export type CmsEntity = Record<string, unknown>;

export interface CmsMediaInput {
  url?: string;
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

/** Minimal shape required to build a RelationSummaryDto */
interface RelationLike {
  documentId: string;
  name?: string | null;
  title?: string | null;
  label?: string | null;
  slug?: string | null;
  url?: string | null;
  order?: number | null;
  type_menu?: string | null;
  [key: string]: unknown;
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

// ─── Internal helpers (not exported) ────────────────────────────────────────

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function unwrapRelation(value: unknown): unknown {
  if (isRecord(value) && 'data' in value) {
    return value.data;
  }
  return value;
}

// ─── Exported utilities ──────────────────────────────────────────────────────

export function isRecord(value: unknown): value is CmsEntity {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function removeUndefined<T extends object>(value: T): T {
  const result = { ...value } as Record<string, unknown>;

  for (const key of Object.keys(result)) {
    if (result[key] === undefined) {
      delete result[key];
    }
  }

  return result as T;
}

export function stripInternalFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripInternalFields);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.entries(value).reduce<CmsEntity>((cleaned, [key, field]) => {
    if (!INTERNAL_FIELDS.has(key)) {
      cleaned[key] = stripInternalFields(field);
    }
    return cleaned;
  }, {});
}

export function sanitizePublicValue(value: unknown): unknown {
  return stripInternalFields(value);
}

/**
 * Maps a media field from CMS schema to MediaSummaryDto.
 * Accepts the typed PluginUploadFileDocument (or null/undefined).
 * Returns undefined when value is undefined, null when explicitly null.
 */
export function mapMediaSummary(
  value: CmsMediaInput | null | undefined,
): MediaSummaryDto | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  return removeUndefined({
    url: value.url ?? undefined,
    alternativeText: value.alternativeText ?? undefined,
    width: value.width ?? undefined,
    height: value.height ?? undefined,
    formats: value.formats,
  });
}

/**
 * Maps a single media field, returning undefined for both null and missing values.
 * Use this for optional icon/image fields where null and absent are equivalent.
 */
export function mapMedia(
  media: CmsMediaInput | null | undefined,
): MediaSummaryDto | undefined {
  if (!media?.url) return undefined;

  return removeUndefined({
    url: media.url,
    alternativeText: media.alternativeText ?? undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    formats: media.formats,
  });
}

/**
 * Maps an array of media items to MediaSummaryDto[].
 * Accepts typed PluginUploadFileDocument[] or unknown (for dynamic zone media).
 */
export function mapMediaArray(
  value: CmsMediaInput[] | null | undefined,
): MediaSummaryDto[] {
  if (!value?.length) return [];

  return value.flatMap((media) => {
    const summary = mapMediaSummary(media);
    return summary ? [summary] : [];
  });
}

/**
 * Maps any object that has at least { documentId } to a RelationSummaryDto.
 * Accepts any Strapi document type — extracts only the summary fields.
 */
export function mapRelationSummary(
  relation: RelationLike | null | undefined,
): RelationSummaryDto | undefined {
  if (!relation) return undefined;

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

/**
 * Maps an array of Strapi documents to RelationSummaryDto[].
 */
export function mapRelationSummaries(
  relations: RelationLike[] | null | undefined,
): RelationSummaryDto[] {
  if (!relations?.length) return [];

  return relations.flatMap((relation) => {
    const summary = mapRelationSummary(relation);
    return summary ? [summary] : [];
  });
}
