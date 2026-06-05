import type { CmsCategory } from '../../infrastructure/strapi/cms-types';
import { mapCategory } from './categories.mapper';

describe('categories mapper', () => {
  it('maps public category fields without back-reference collections', () => {
    const input = {
      id: 1,
      documentId: 'category-1',
      name: 'News',
      slug: 'news',
      description: 'Latest news',
      publishedAt: '2026-06-05T00:00:00.000Z',
    } satisfies CmsCategory;

    const result = mapCategory(input);

    expect(result).toEqual({
      documentId: 'category-1',
      name: 'News',
      slug: 'news',
      description: 'Latest news',
    });
  });

  it('handles null and empty back-reference collections by omitting them', () => {
    const result = mapCategory({
      id: 2,
      documentId: 'category-2',
      name: 'Support',
      publishedAt: '2026-06-05T00:00:00.000Z',
      articles: [],
      faqs: null,
    });

    expect(result).toEqual({
      documentId: 'category-2',
      name: 'Support',
    });
  });
});
