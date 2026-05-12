import { mapPromotion } from './promotions.mapper';

describe('promotions mapper', () => {
  it('maps promotion media and related product summaries', () => {
    const result = mapPromotion({
      id: 1,
      documentId: 'promotion-1',
      title: 'Summer offer',
      slug: 'summer-offer',
      short_description: 'Cashback for selected products',
      content: [{ type: 'paragraph', children: [{ text: 'Apply today' }] }],
      start_date: '2026-06-01T00:00:00.000Z',
      end_date: '2026-06-30T00:00:00.000Z',
      cta_label: 'Apply now',
      cta_link: '/apply',
      createdBy: { id: 2 },
      banner: [
        {
          id: 10,
          url: '/uploads/promo.png',
          alternativeText: 'Promotion banner',
          width: 640,
          height: 360,
          formats: { thumbnail: { url: '/uploads/promo-thumb.png' } },
          provider: 'local',
        },
      ],
      products: [
        {
          id: 11,
          documentId: 'product-1',
          name: 'Premier Account',
          slug: 'premier-account',
          promotions: [{ documentId: 'back-ref' }],
        },
      ],
    });

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
    const result = mapPromotion({
      documentId: 'promotion-2',
      title: 'No banner promo',
      products: [],
    });

    expect(result).toEqual({
      documentId: 'promotion-2',
      title: 'No banner promo',
      banner: [],
      products: [],
    });
  });

  it('handles null relation arrays and null media relations', () => {
    expect(
      mapPromotion({
        documentId: 'promotion-3',
        banner: null,
        products: null,
      }),
    ).toEqual({
      documentId: 'promotion-3',
      banner: [],
      products: [],
    });
  });
});
