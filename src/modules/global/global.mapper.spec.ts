import type { CmsGlobal } from '../../infrastructure/strapi/cms-types';
import { mapGlobal } from './global.mapper';

describe('mapGlobal', () => {
  it('maps media summaries and strips internal media fields', () => {
    const input = {
      documentId: 'global-doc',
      id: 1,
      siteName: 'TPB',
      siteDescription: 'Site description',
      analytics_script: [],
      publishedAt: '2026-06-05T00:00:00.000Z',
      favicon: {
        id: 1,
        documentId: 'media-1',
        name: 'favicon.ico',
        url: '/favicon.ico',
        alternativeText: 'Favicon',
        width: 32,
        height: 32,
        formats: { thumbnail: { url: '/thumb.ico' } },
        hash: 'favicon',
        mime: 'image/x-icon',
        size: 1.2,
        provider: 'local',
        publishedAt: '2026-06-05T00:00:00.000Z',
        related: [],
      },
      defaultSeo: {
        metaTitle: 'Default title',
        metaDescription: 'Default description',
      },
    } satisfies CmsGlobal;

    const result = mapGlobal(input);

    expect(result).toEqual({
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
      analytics_script: [],
      favicon: {
        url: '/favicon.ico',
        alternativeText: 'Favicon',
        width: 32,
        height: 32,
        formats: { thumbnail: { url: '/thumb.ico' } },
      },
      defaultSeo: {
        metaTitle: 'Default title',
        metaDescription: 'Default description',
      },
    });
  });

  it('omits missing media fields and sanitizes unknown dynamic blocks', () => {
    const input = {
      documentId: 'global-doc',
      id: 1,
      siteName: 'TPB',
      siteDescription: 'Site description',
      analytics_script: [
        {
          id: 7,
          __component: 'global.unregistered-script',
          body: 'console.log("ok")',
          provider: 'internal',
        },
      ],
      publishedAt: '2026-06-05T00:00:00.000Z',
    } satisfies CmsGlobal;

    expect(mapGlobal(input)).toEqual({
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
      analytics_script: [
        {
          __component: 'global.unregistered-script',
          body: 'console.log("ok")',
        },
      ],
    });
  });

  it('handles null media relations and null block relations', () => {
    expect(
      mapGlobal({
        documentId: 'global-doc',
        id: 1,
        siteName: 'TPB',
        siteDescription: 'Site description',
        publishedAt: '2026-06-05T00:00:00.000Z',
        favicon: null,
        logo: null,
        defaultSeo: {
          metaTitle: 'Default title',
          metaDescription: null,
          shareImage: null,
        },
        analytics_script: null,
      }),
    ).toEqual({
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
      defaultSeo: {
        metaTitle: 'Default title',
      },
    });
  });
});
