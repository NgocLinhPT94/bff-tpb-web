import type { CmsPromotion } from '../../infrastructure/strapi/cms-types';
import { mapPromotion } from './promotions.mapper';

describe('promotions mapper', () => {
  it('maps promotion media and related product summaries', () => {
    const promotion = {
      id: 1,
      documentId: 'promotion-1',
      title: 'Summer offer',
      slug: 'summer-offer',
      short_description: 'Cashback for selected products',
      content: [
        {
          type: 'paragraph',
          children: [{ text: 'Apply today' }],
        },
      ],
      start_date: '2026-06-01T00:00:00.000Z',
      end_date: '2026-06-30T00:00:00.000Z',
      cta_label: 'Apply now',
      cta_link: '/apply',
      publishedAt: '2026-05-11T00:00:00.000Z',
      banner: [
        {
          id: 10,
          documentId: 'promo-banner-1',
          name: 'promo.png',
          url: '/uploads/promo.png',
          alternativeText: 'Promotion banner',
          width: 640,
          height: 360,
          formats: { thumbnail: { url: '/uploads/promo-thumb.png' } },
          hash: 'promo',
          mime: 'image/png',
          size: 1,
          provider: 'local',
          publishedAt: '2026-05-11T00:00:00.000Z',
          related: null,
        },
      ],
      products: [
        {
          id: 11,
          documentId: 'product-1',
          name: 'Premier Account',
          slug: 'premier-account',
          publishedAt: '2026-05-11T00:00:00.000Z',
          promotions: [
            {
              id: 110,
              documentId: 'back-ref',
              content: [],
              publishedAt: '2026-05-11T00:00:00.000Z',
            },
          ],
        },
      ],
    } satisfies CmsPromotion;

    const result = mapPromotion(promotion);

    expect(result).toEqual({
      documentId: 'promotion-1',
      title: 'Summer offer',
      slug: 'summer-offer',
      shortDescription: 'Cashback for selected products',
      content: [{ type: 'paragraph', children: [{ text: 'Apply today' }] }],
      startDate: '2026-06-01T00:00:00.000Z',
      endDate: '2026-06-30T00:00:00.000Z',
      ctaLabel: 'Apply now',
      ctaLink: '/apply',
      banner: [
        {
          url: '/uploads/promo.png',
          alternativeText: 'Promotion banner',
          width: 640,
          height: 360,
          formats: { thumbnail: { url: '/uploads/promo-thumb.png' } },
        },
      ],
      products: [
        {
          documentId: 'product-1',
          name: 'Premier Account',
          slug: 'premier-account',
        },
      ],
    });
  });

  it('handles missing media fields and empty relation arrays', () => {
    const promotion = {
      id: 2,
      documentId: 'promotion-2',
      title: 'No banner promo',
      content: [],
      publishedAt: '2026-05-11T00:00:00.000Z',
      products: [],
    } satisfies CmsPromotion;

    const result = mapPromotion(promotion);

    expect(result).toEqual({
      documentId: 'promotion-2',
      title: 'No banner promo',
      content: [],
      banner: [],
      products: [],
    });
  });

  it('handles null relation arrays and null media relations', () => {
    expect(
      mapPromotion({
        id: 3,
        documentId: 'promotion-3',
        publishedAt: '2026-05-11T00:00:00.000Z',
        banner: null,
        products: null,
      } as unknown as CmsPromotion),
    ).toEqual({
      documentId: 'promotion-3',
      banner: [],
      products: [],
    });
  });
});
