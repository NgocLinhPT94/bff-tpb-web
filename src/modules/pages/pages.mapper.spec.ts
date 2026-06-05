import type { CmsPage } from '../../infrastructure/strapi/cms-types';
import { mapPage } from './pages.mapper';

describe('mapPage', () => {
  it('maps null dynamic-zone relation to an empty array', () => {
    const input = {
      documentId: 'page-doc',
      id: 1,
      title: 'Home',
      publishedAt: '2026-06-05T00:00:00.000Z',
      sections: null,
    };

    expect(mapPage(input)).toEqual({
      documentId: 'page-doc',
      title: 'Home',
      sections: [],
    });
  });

  it('maps empty dynamic-zone arrays and omits missing optional text', () => {
    const input = {
      documentId: 'page-doc',
      id: 1,
      publishedAt: '2026-06-05T00:00:00.000Z',
      sections: [],
    } satisfies CmsPage;

    expect(mapPage(input)).toEqual({
      documentId: 'page-doc',
      sections: [],
    });
  });

  it('preserves unknown component fallback names and sanitizes nested metadata', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        id: 1,
        publishedAt: '2026-06-05T00:00:00.000Z',
        sections: [
          {
            id: 7,
            __component: 'blocks.unregistered-experiment',
            heading: 'Fallback section',
            media: {
              id: 8,
              url: '/fallback.jpg',
              alternativeText: 'Fallback',
              provider: 'local',
              related: [],
            },
          },
        ],
      } satisfies CmsPage),
    ).toEqual({
      documentId: 'page-doc',
      sections: [
        {
          __component: 'blocks.unregistered-experiment',
          heading: 'Fallback section',
          media: {
            url: '/fallback.jpg',
            alternativeText: 'Fallback',
          },
        },
      ],
    });
  });

  it('preserves component names and strips internal metadata from dynamic zones', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        id: 1,
        publishedAt: '2026-06-05T00:00:00.000Z',
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
      } satisfies CmsPage),
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
        id: 1,
        publishedAt: '2026-06-05T00:00:00.000Z',
        sections: [{ __component: 'blocks.product-highlight', title: 'Loans' }],
      } satisfies CmsPage),
    ).toEqual({
      documentId: 'page-doc',
      sections: [{ __component: 'blocks.product-highlight', title: 'Loans' }],
    });
  });
});
