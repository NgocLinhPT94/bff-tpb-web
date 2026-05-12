import { mapCategory } from './categories.mapper';

describe('categories mapper', () => {
  it('maps public category fields without back-reference collections', () => {
    const result = mapCategory({
      id: 1,
      documentId: 'category-1',
      name: 'News',
      slug: 'news',
      description: 'Latest news',
      createdBy: { id: 2 },
      articles: [{ documentId: 'article-back-ref' }],
      faqs: [{ documentId: 'faq-back-ref' }],
    });

    expect(result).toEqual({
      documentId: 'category-1',
      name: 'News',
      slug: 'news',
      description: 'Latest news',
    });
  });

  it('handles null and empty back-reference collections by omitting them', () => {
    const result = mapCategory({
      documentId: 'category-2',
      name: 'Support',
      articles: [],
      faqs: null,
    });

    expect(result).toEqual({
      documentId: 'category-2',
      name: 'Support',
    });
  });
});
