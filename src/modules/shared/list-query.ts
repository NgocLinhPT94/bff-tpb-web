import type { ListQueryDto } from '../../common/query';

type StrapiParamValue = string | number | boolean | undefined;

export function buildPopulateParams(
  populate: string | readonly string[],
): Record<string, StrapiParamValue> {
  if (typeof populate !== 'string') {
    return Object.fromEntries(
      populate.map((field, index) => [`populate[${index}]`, field]),
    );
  }

  return { populate };
}

export function buildStrapiListParams(
  query: ListQueryDto,
  populate: string | readonly string[],
): Record<string, StrapiParamValue> {
  return {
    'pagination[page]': query.page,
    'pagination[pageSize]': query.pageSize,
    sort: query.sort,
    ...buildPopulateParams(populate),
  };
}
