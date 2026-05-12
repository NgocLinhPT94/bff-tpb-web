export const articleEntity = {
  id: 1,
  documentId: 'article-1',
  title: 'Market update',
  description: 'Daily market update',
  content: [{ type: 'paragraph', children: [{ text: 'Read more' }] }],
  slug: 'market-update',
  publish_date: '2026-05-11T00:00:00.000Z',
  cover: {
    id: 10,
    documentId: 'cover-1',
    url: '/uploads/cover.png',
    alternativeText: 'Cover image',
    width: 1200,
    height: 630,
    formats: { thumbnail: { url: '/uploads/cover-thumb.png' } },
    provider: 'local',
  },
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
};

export const articleListResponse = {
  data: [articleEntity],
  meta: {
    pagination: {
      page: 1,
      pageSize: 20,
      pageCount: 1,
      total: 1,
    },
  },
};

export const emptyArticleListResponse = {
  data: [],
  meta: {
    pagination: {
      page: 1,
      pageSize: 20,
      pageCount: 0,
      total: 0,
    },
  },
};

export const articleDetailResponse = {
  data: articleEntity,
};
