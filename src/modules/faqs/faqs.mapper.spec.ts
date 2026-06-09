import { mapFaq } from './faqs.mapper';

describe('faqs mapper', () => {
  it('maps FAQ fields, category and product summary without circular back-references', () => {
    const result = mapFaq({
      id: 1,
      documentId: 'faq-1',
      question: 'How do I apply?',
      answer: [{ id: 100, type: 'paragraph', children: [{ text: 'Online' }] }],
      slug: 'how-do-i-apply',
      active: true,
      sortOrder: 1,
      category: {
        id: 2,
        documentId: 'category-1',
        name: 'Applications',
        articles: [{ documentId: 'article-back-ref' }],
        faqs: [{ documentId: 'faq-back-ref' }],
      },
      product: {
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
      },
    });

    expect(result).toEqual({
      documentId: 'faq-1',
      question: 'How do I apply?',
      answer: [{ type: 'paragraph', children: [{ text: 'Online' }] }],
      slug: 'how-do-i-apply',
      active: true,
      sortOrder: 1,
      category: { documentId: 'category-1', name: 'Applications' },
      product: {
        documentId: 'product-1',
        name: 'Premier Account',
        slug: 'premier-account',
        product_type: 'account',
        short_description: 'Everyday banking',
        thumbnail: { url: '/uploads/thumb.png', alternativeText: 'Product thumbnail' },
      },
    });
  });

  it('handles null relations', () => {
    expect(mapFaq({ documentId: 'faq-2', category: null, product: null })).toEqual({
      documentId: 'faq-2',
      category: null,
      product: null,
    });
  });

  it('omits optional fields when not present', () => {
    expect(mapFaq({ documentId: 'faq-3', question: 'Test?' })).toEqual({
      documentId: 'faq-3',
      question: 'Test?',
    });
  });
});
