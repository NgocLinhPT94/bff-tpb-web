import { mapCategory } from './categories.mapper';

describe('categories mapper', () => {
  it('maps public category fields without back-reference collections', () => {
    const result = mapCategory({
      documentId: 'category-1',
      id: 1,
      name: 'News',
      slug: 'news',
      description: 'Latest news',
      publishedAt: '2026-05-11T00:00:00.000Z',
      createdAt: '2026-05-11T00:00:00.000Z',
      articles: [{ documentId: 'article-back-ref' } as never],
      faqs: [{ documentId: 'faq-back-ref' } as never],
    });

    expect(result).toEqual({
      documentId: 'category-1',
      name: 'News',
      slug: 'news',
      description: 'Latest news',
    });
  });

  it('handles missing optional fields', () => {
    const result = mapCategory({
      documentId: 'category-2',
      id: 2,
      name: 'Support',
      slug: 'support',
      publishedAt: '2026-05-11T00:00:00.000Z',
    });

    expect(result).toEqual({
      documentId: 'category-2',
      name: 'Support',
      slug: 'support',
    });
  });
});
