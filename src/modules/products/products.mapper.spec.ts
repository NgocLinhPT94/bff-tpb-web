import type { CmsProduct } from '../../infrastructure/strapi/cms-types';
import { ProductType } from './products.dto';
import { mapProduct } from './products.mapper';

describe('products mapper', () => {
  it('maps product media, product type, and relation summaries', () => {
    const product = {
      id: 1,
      documentId: 'product-1',
      name: 'Premier Account',
      slug: 'premier-account',
      product_type: 'account',
      short_description: 'Everyday banking',
      createdAt: '2026-05-11T00:00:00.000Z',
      publishedAt: '2026-05-11T00:00:00.000Z',
      thumbnail: {
        id: 10,
        documentId: 'thumb-1',
        name: 'thumb.png',
        url: '/uploads/thumb.png',
        alternativeText: 'Thumbnail',
        width: 320,
        height: 180,
        formats: { small: { url: '/uploads/small.png' } },
        hash: 'thumb',
        mime: 'image/png',
        size: 1,
        provider: 'local',
        publishedAt: '2026-05-11T00:00:00.000Z',
        related: null,
      },
      main_banner: {
        id: 11,
        documentId: 'banner-1',
        name: 'banner.png',
        url: '/uploads/banner.png',
        alternativeText: null,
        hash: 'banner',
        mime: 'image/png',
        size: 1,
        provider: 'local',
        publishedAt: '2026-05-11T00:00:00.000Z',
        related: null,
      },
      documents: [
        {
          id: 12,
          documentId: 'terms-1',
          name: 'terms.pdf',
          url: '/uploads/terms.pdf',
          hash: 'terms',
          mime: 'application/pdf',
          size: 1,
          provider: 'local',
          publishedAt: '2026-05-11T00:00:00.000Z',
          related: null,
        },
      ],
      faqs: [
        {
          id: 11,
          documentId: 'faq-1',
          question: 'How do I apply?',
          answer: [],
          publishedAt: '2026-05-11T00:00:00.000Z',
          products: [
            {
              id: 110,
              documentId: 'back-ref',
              publishedAt: '2026-05-11T00:00:00.000Z',
            },
          ],
        },
      ],
      promotions: [
        {
          id: 12,
          documentId: 'promotion-1',
          title: 'Summer offer',
          slug: 'summer-offer',
          content: [],
          publishedAt: '2026-05-11T00:00:00.000Z',
          products: [
            {
              id: 120,
              documentId: 'back-ref',
              publishedAt: '2026-05-11T00:00:00.000Z',
            },
          ],
        },
      ],
    } satisfies CmsProduct;

    const result = mapProduct(product);

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
    const product = {
      id: 2,
      documentId: 'product-2',
      product_type: 'loan',
      publishedAt: '2026-05-11T00:00:00.000Z',
      faqs: [],
      promotions: [],
    } satisfies CmsProduct;

    const result = mapProduct(product);

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
        id: 3,
        documentId: 'product-3',
        publishedAt: '2026-05-11T00:00:00.000Z',
        thumbnail: null,
        main_banner: null,
        documents: null,
        faqs: null,
        promotions: null,
      } as unknown as CmsProduct),
    ).toEqual({
      documentId: 'product-3',
      documents: [],
      faqs: [],
      promotions: [],
    });
  });
});
