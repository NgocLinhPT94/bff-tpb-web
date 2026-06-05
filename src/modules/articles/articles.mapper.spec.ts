import type { CmsArticle } from '../../infrastructure/strapi/cms-types';
import { mapArticle } from './articles.mapper';

describe('articles mapper', () => {
  it('maps article media and relation summaries without circular back-references', () => {
    const article = {
      id: 1,
      documentId: 'article-1',
      title: 'Market update',
      description: 'Daily update',
      content: [
        { id: 100, type: 'paragraph', children: [{ text: 'Read more' }] },
      ],
      slug: 'market-update',
      publish_date: '2026-05-11T00:00:00.000Z',
      publishedAt: '2026-05-11T00:00:00.000Z',
      blocks: [
        {
          id: 101,
          __component: 'blocks.unregistered-article-block',
          body: 'Unknown block fallback',
          provider: 'internal',
        },
      ],
      seo: {
        metaTitle: 'Market update SEO',
        metaDescription: 'SEO description',
      },
      cover: {
        id: 10,
        documentId: 'cover-1',
        name: 'cover.png',
        url: '/uploads/cover.png',
        alternativeText: 'Cover',
        hash: 'cover',
        mime: 'image/png',
        size: 1,
        provider: 'local',
        provider_metadata: { internal: true },
        publishedAt: '2026-05-11T00:00:00.000Z',
        related: null,
      },
      author: {
        id: 2,
        documentId: 'author-1',
        name: 'Jane Writer',
        publishedAt: '2026-05-11T00:00:00.000Z',
        articles: [
          {
            id: 20,
            documentId: 'back-ref',
            content: [],
            publishedAt: '2026-05-11T00:00:00.000Z',
          },
        ],
      },
      category: {
        id: 3,
        documentId: 'category-1',
        name: 'News',
        publishedAt: '2026-05-11T00:00:00.000Z',
        articles: [
          {
            id: 30,
            documentId: 'back-ref',
            content: [],
            publishedAt: '2026-05-11T00:00:00.000Z',
          },
        ],
        faqs: [
          {
            id: 31,
            documentId: 'faq-back-ref',
            answer: [],
            publishedAt: '2026-05-11T00:00:00.000Z',
          },
        ],
      },
    } satisfies CmsArticle;

    const result = mapArticle(article);

    expect(result).toEqual({
      documentId: 'article-1',
      title: 'Market update',
      description: 'Daily update',
      content: [{ type: 'paragraph', children: [{ text: 'Read more' }] }],
      slug: 'market-update',
      publish_date: '2026-05-11T00:00:00.000Z',
      blocks: [
        {
          __component: 'blocks.unregistered-article-block',
          body: 'Unknown block fallback',
        },
      ],
      seo: {
        metaTitle: 'Market update SEO',
        metaDescription: 'SEO description',
      },
      cover: {
        url: '/uploads/cover.png',
        alternativeText: 'Cover',
      },
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
        id: 2,
        documentId: 'article-2',
        publishedAt: '2026-05-11T00:00:00.000Z',
        cover: null,
        author: null,
        category: { data: null },
      } as unknown as CmsArticle),
    ).toEqual({
      documentId: 'article-2',
      cover: null,
      author: null,
      category: null,
    });

    expect(
      mapArticle({
        id: 3,
        documentId: 'article-3',
        publishedAt: '2026-05-11T00:00:00.000Z',
        author: { documentId: 'author-3', articles: [] },
        category: { documentId: 'category-3', articles: [], faqs: [] },
      } as unknown as CmsArticle),
    ).toEqual({
      documentId: 'article-3',
      author: { documentId: 'author-3' },
      category: { documentId: 'category-3' },
    });
  });
});
