import type { ListQueryDto } from '../query/list-query.dto';

type CmsParamValue = string | number | boolean | undefined;

/**
 * Build CMS populate params from a string or array of field names.
 */
export function buildPopulateParams(
  populate: string | readonly string[],
): Record<string, CmsParamValue> {
  if (typeof populate !== 'string') {
    return Object.fromEntries(
      populate.map((field, index) => [`populate[${index}]`, field]),
    );
  }

  return { populate };
}

/**
 * Build CMS list query params (pagination + sort + populate).
 */
export function buildCmsListParams(
  query: ListQueryDto,
  populate: string | readonly string[],
): Record<string, CmsParamValue> {
  return {
    'pagination[page]': query.page,
    'pagination[pageSize]': query.pageSize,
    sort: query.sort,
    ...buildPopulateParams(populate),
  };
}
