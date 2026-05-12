import { mapFaq } from './faqs.mapper';

describe('faqs mapper', () => {
  it('maps FAQ category and product summaries without circular back-references', () => {
    const result = mapFaq({
      id: 1,
      documentId: 'faq-1',
      question: 'How do I apply?',
      answer: [{ id: 100, type: 'paragraph', children: [{ text: 'Online' }] }],
      active: true,
      category: {
        id: 2,
        documentId: 'category-1',
        name: 'Applications',
        articles: [{ documentId: 'article-back-ref' }],
        faqs: [{ documentId: 'faq-back-ref' }],
      },
      products: [
        {
          id: 3,
          documentId: 'product-1',
          name: 'Premier Account',
          slug: 'premier-account',
          product_type: 'account',
          short_description: 'Everyday banking',
          thumbnail: {
            id: 10,
            documentId: 'thumb-1',
            url: '/uploads/thumb.png',
            alternativeText: 'Product thumbnail',
            provider: 'local',
          },
          faqs: [{ documentId: 'faq-back-ref' }],
          promotions: [{ documentId: 'promotion-back-ref' }],
        },
      ],
    });

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
        documentId: 'faq-2',
        category: null,
        products: [],
      }),
    ).toEqual({
      documentId: 'faq-2',
      category: null,
      products: [],
    });

    expect(
      mapFaq({
        documentId: 'faq-3',
        category: { data: null },
        products: [{ documentId: 'product-3' }],
      }),
    ).toEqual({
      documentId: 'faq-3',
      category: null,
      products: [{ documentId: 'product-3' }],
    });
  });
});
