import { mapArticle } from './articles.mapper';

describe('articles mapper', () => {
  it('maps article media and relation summaries without circular back-references', () => {
    const result = mapArticle({
      id: 1,
      documentId: 'article-1',
      title: 'Market update',
      description: 'Daily update',
      content: [
        { id: 100, type: 'paragraph', children: [{ text: 'Read more' }] },
      ],
      slug: 'market-update',
      publish_date: '2026-05-11T00:00:00.000Z',
      articleType: 'news',
      customerSegment: 'individual',
      cover: {
        id: 10,
        documentId: 'cover-1',
        url: '/uploads/cover.png',
        alternativeText: 'Cover',
        provider_metadata: { internal: true },
      },
      tags: [
        { documentId: 'tag-1', name: 'Digital Banking', slug: 'digital-banking', articles: [] },
      ],
      author: {
        id: 2,
        documentId: 'author-1',
        name: 'Jane Writer',
        articles: [{ documentId: 'back-ref' }],
      },
      category: {
        id: 3,
        documentId: 'category-1',
        name: 'News',
        articles: [{ documentId: 'back-ref' }],
        faqs: [{ documentId: 'faq-back-ref' }],
      },
    });

    expect(result).toEqual({
      documentId: 'article-1',
      title: 'Market update',
      description: 'Daily update',
      content: [{ type: 'paragraph', children: [{ text: 'Read more' }] }],
      slug: 'market-update',
      publish_date: '2026-05-11T00:00:00.000Z',
      articleType: 'news',
      customerSegment: 'individual',
      cover: {
        url: '/uploads/cover.png',
        alternativeText: 'Cover',
      },
      tags: [{ documentId: 'tag-1', name: 'Digital Banking', slug: 'digital-banking' }],
      author: {
        documentId: 'author-1',
        name: 'Jane Writer',
      },
      category: {
        documentId: 'category-1',
        name: 'News',
      },
    });
  });

  it('handles null relations, empty array relations, and missing media fields', () => {
    expect(
      mapArticle({
        documentId: 'article-2',
        content: [],
        customerSegment: 'all',
        cover: null,
        author: null,
        category: null,
      }),
    ).toEqual({
      documentId: 'article-2',
      content: [],
      customerSegment: 'all',
      cover: null,
      author: null,
      category: null,
    });

    expect(
      mapArticle({
        documentId: 'article-3',
        content: [],
        customerSegment: 'all',
        tags: [],
        author: { documentId: 'author-3', name: 'Author', articles: [] },
        category: { documentId: 'category-3', articles: [], faqs: [] },
      }),
    ).toEqual({
      documentId: 'article-3',
      content: [],
      customerSegment: 'all',
      tags: [],
      author: { documentId: 'author-3', name: 'Author' },
      category: { documentId: 'category-3' },
    });
  });
});
