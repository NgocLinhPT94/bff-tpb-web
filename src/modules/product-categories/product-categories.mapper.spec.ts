import { mapProductCategory } from './product-categories.mapper';

describe('product-categories mapper', () => {
  it('maps public fields, media, and relation summaries', () => {
    const result = mapProductCategory({
      id: 1,
      documentId: 'cat-1',
      name: 'Credit Cards',
      slug: 'credit-cards',
      description: 'All credit card products',
      icon: {
        id: 10,
        documentId: 'icon-1',
        url: '/uploads/icon.png',
        alternativeText: 'Card icon',
        provider_metadata: { internal: true },
      },
      bannerImage: [
        {
          id: 20,
          documentId: 'banner-1',
          url: '/uploads/banner.jpg',
          alternativeText: 'Banner',
          provider_metadata: { internal: true },
        },
      ],
      sortOrder: 1,
      isActive: true,
      seo: { id: 5, metaTitle: 'Credit Cards', metaDescription: 'Best cards' },
      publishedDate: '2026-01-15',
      ProductCategory: [
        { documentId: 'product-1', name: 'Platinum Card' },
      ],
      promotions: [
        { documentId: 'promo-1', title: 'Summer Deal' },
      ],
    });

    expect(result).toEqual({
      documentId: 'cat-1',
      name: 'Credit Cards',
      slug: 'credit-cards',
      description: 'All credit card products',
      icon: {
        url: '/uploads/icon.png',
        alternativeText: 'Card icon',
      },
      bannerImage: [
        {
          url: '/uploads/banner.jpg',
          alternativeText: 'Banner',
        },
      ],
      sortOrder: 1,
      isActive: true,
      seo: { metaTitle: 'Credit Cards', metaDescription: 'Best cards' },
      publishedDate: '2026-01-15',
      products: [{ documentId: 'product-1', name: 'Platinum Card' }],
      promotions: [{ documentId: 'promo-1', title: 'Summer Deal' }],
    });
  });

  it('handles null icon, empty relations, and missing optional fields', () => {
    const result = mapProductCategory({
      documentId: 'cat-2',
      name: 'Loans',
      icon: null,
      bannerImage: null,
      ProductCategory: [],
      promotions: null,
    });

    expect(result).toEqual({
      documentId: 'cat-2',
      name: 'Loans',
      bannerImage: [],
      products: [],
      promotions: [],
    });
  });

  it('omits undefined optional fields', () => {
    const result = mapProductCategory({
      documentId: 'cat-3',
    });

    expect(result).toEqual({
      documentId: 'cat-3',
      bannerImage: [],
      products: [],
      promotions: [],
    });
  });
});
