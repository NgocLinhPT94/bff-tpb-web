import type { CmsFaq } from '../../infrastructure/strapi/cms-types';
import { mapFaq } from './faqs.mapper';

describe('faqs mapper', () => {
  it('maps FAQ category and product summaries without circular back-references', () => {
    const faq = {
      id: 1,
      documentId: 'faq-1',
      question: 'How do I apply?',
      answer: [{ id: 100, type: 'paragraph', children: [{ text: 'Online' }] }],
      active: true,
      publishedAt: '2026-05-11T00:00:00.000Z',
      category: {
        id: 2,
        documentId: 'category-1',
        name: 'Applications',
        publishedAt: '2026-05-11T00:00:00.000Z',
        articles: [
          {
            id: 20,
            documentId: 'article-back-ref',
            content: [],
            publishedAt: '2026-05-11T00:00:00.000Z',
          },
        ],
        faqs: [
          {
            id: 21,
            documentId: 'faq-back-ref',
            answer: [],
            publishedAt: '2026-05-11T00:00:00.000Z',
          },
        ],
      },
      products: [
        {
          id: 3,
          documentId: 'product-1',
          name: 'Premier Account',
          slug: 'premier-account',
          product_type: 'account',
          short_description: 'Everyday banking',
          publishedAt: '2026-05-11T00:00:00.000Z',
          thumbnail: {
            id: 10,
            documentId: 'thumb-1',
            name: 'thumb.png',
            url: '/uploads/thumb.png',
            alternativeText: 'Product thumbnail',
            hash: 'thumb',
            mime: 'image/png',
            size: 1,
            provider: 'local',
            publishedAt: '2026-05-11T00:00:00.000Z',
            related: null,
          },
          faqs: [
            {
              id: 30,
              documentId: 'faq-back-ref',
              answer: [],
              publishedAt: '2026-05-11T00:00:00.000Z',
            },
          ],
          promotions: [
            {
              id: 31,
              documentId: 'promotion-back-ref',
              content: [],
              publishedAt: '2026-05-11T00:00:00.000Z',
            },
          ],
        },
      ],
    } satisfies CmsFaq;

    const result = mapFaq(faq);

    expect(result).toEqual({
      documentId: 'faq-1',
      question: 'How do I apply?',
      answer: [{ type: 'paragraph', children: [{ text: 'Online' }] }],
      active: true,
      category: {
        documentId: 'category-1',
        name: 'Applications',
      },
      products: [
        {
          documentId: 'product-1',
          name: 'Premier Account',
          slug: 'premier-account',
          product_type: 'account',
          short_description: 'Everyday banking',
          thumbnail: {
            url: '/uploads/thumb.png',
            alternativeText: 'Product thumbnail',
          },
        },
      ],
    });
  });

  it('handles null relation, empty product relation array, and missing media field', () => {
    expect(
      mapFaq({
        id: 2,
        documentId: 'faq-2',
        publishedAt: '2026-05-11T00:00:00.000Z',
        category: null,
        products: [],
      } as unknown as CmsFaq),
    ).toEqual({
      documentId: 'faq-2',
      category: null,
      products: [],
    });

    expect(
      mapFaq({
        id: 3,
        documentId: 'faq-3',
        publishedAt: '2026-05-11T00:00:00.000Z',
        category: { data: null },
        products: [{ documentId: 'product-3' }],
      } as unknown as CmsFaq),
    ).toEqual({
      documentId: 'faq-3',
      category: null,
      products: [{ documentId: 'product-3' }],
    });
  });
});
