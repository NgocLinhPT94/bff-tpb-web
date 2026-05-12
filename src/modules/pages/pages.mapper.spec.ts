import { mapPage } from './pages.mapper';

describe('mapPage', () => {
  it('maps null dynamic-zone relation to an empty array', () => {
    expect(
      mapPage({ documentId: 'page-doc', title: 'Home', sections: null }),
    ).toEqual({
      documentId: 'page-doc',
      title: 'Home',
      sections: [],
    });
  });

  it('maps empty dynamic-zone arrays', () => {
    expect(mapPage({ documentId: 'page-doc', sections: [] })).toEqual({
      documentId: 'page-doc',
      sections: [],
    });
  });

  it('preserves component names and strips internal metadata from dynamic zones', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        slug: 'home',
        sections: [
          {
            id: 1,
            __component: 'blocks.cta-banner',
            title: 'Apply now',
            media: {
              id: 2,
              url: '/banner.jpg',
              alternativeText: 'Banner',
              width: 1200,
              height: 630,
              formats: { thumbnail: { url: '/thumb.jpg' } },
              provider: 'local',
              related: [],
            },
            createdAt: 'internal',
          },
          {
            __component: 'blocks.faq-block',
            items: [],
          },
        ],
      }),
    ).toEqual({
      documentId: 'page-doc',
      slug: 'home',
      sections: [
        {
          __component: 'blocks.cta-banner',
          title: 'Apply now',
          media: {
            url: '/banner.jpg',
            alternativeText: 'Banner',
            width: 1200,
            height: 630,
            formats: { thumbnail: { url: '/thumb.jpg' } },
          },
        },
        {
          __component: 'blocks.faq-block',
          items: [],
        },
      ],
    });
  });

  it('handles sections with missing media fields', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        sections: [{ __component: 'blocks.product-highlight', title: 'Loans' }],
      }),
    ).toEqual({
      documentId: 'page-doc',
      sections: [{ __component: 'blocks.product-highlight', title: 'Loans' }],
    });
  });
});
