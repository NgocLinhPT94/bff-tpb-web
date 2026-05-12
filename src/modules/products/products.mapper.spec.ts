import { ProductType } from './products.dto';
import { mapProduct } from './products.mapper';

describe('products mapper', () => {
  it('maps product media, product type, and relation summaries', () => {
    const result = mapProduct({
      id: 1,
      documentId: 'product-1',
      name: 'Premier Account',
      slug: 'premier-account',
      product_type: 'account',
      short_description: 'Everyday banking',
      createdAt: '2026-05-11T00:00:00.000Z',
      updatedBy: { id: 2 },
      thumbnail: {
        id: 10,
        url: '/uploads/thumb.png',
        alternativeText: 'Thumbnail',
        width: 320,
        height: 180,
        formats: { small: { url: '/uploads/small.png' } },
        provider: 'local',
      },
      main_banner: {
        url: '/uploads/banner.png',
        alternativeText: null,
      },
      documents: [{ url: '/uploads/terms.pdf' }],
      faqs: [
        {
          id: 11,
          documentId: 'faq-1',
          question: 'How do I apply?',
          products: [{ documentId: 'back-ref' }],
        },
      ],
      promotions: [
        {
          id: 12,
          documentId: 'promotion-1',
          title: 'Summer offer',
          slug: 'summer-offer',
          products: [{ documentId: 'back-ref' }],
        },
      ],
    });

    expect(result).toEqual({
      documentId: 'product-1',
      name: 'Premier Account',
      slug: 'premier-account',
      productType: ProductType.ACCOUNT,
      shortDescription: 'Everyday banking',
      thumbnail: {
        url: '/uploads/thumb.png',
        alternativeText: 'Thumbnail',
        width: 320,
        height: 180,
        formats: { small: { url: '/uploads/small.png' } },
      },
      mainBanner: {
        url: '/uploads/banner.png',
      },
      documents: [{ url: '/uploads/terms.pdf' }],
      faqs: [{ documentId: 'faq-1', question: 'How do I apply?' }],
      promotions: [
        {
          documentId: 'promotion-1',
          title: 'Summer offer',
          slug: 'summer-offer',
        },
      ],
    });
  });

  it('handles missing media fields and empty relation arrays', () => {
    const result = mapProduct({
      documentId: 'product-2',
      product_type: 'loan',
      faqs: [],
      promotions: [],
    });

    expect(result).toEqual({
      documentId: 'product-2',
      productType: ProductType.LOAN,
      documents: [],
      faqs: [],
      promotions: [],
    });
  });

  it('handles null relation arrays and null media relations', () => {
    expect(
      mapProduct({
        documentId: 'product-3',
        thumbnail: null,
        main_banner: null,
        documents: null,
        faqs: null,
        promotions: null,
      }),
    ).toEqual({
      documentId: 'product-3',
      documents: [],
      faqs: [],
      promotions: [],
    });
  });
});
