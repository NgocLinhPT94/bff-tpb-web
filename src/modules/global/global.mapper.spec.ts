import { mapGlobal, type StrapiGlobal } from './global.mapper';

describe('mapGlobal', () => {
  it('maps media summaries and strips internal media fields', () => {
    const result = mapGlobal({
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
      favicon: {
        id: 1,
        url: '/favicon.ico',
        alternativeText: 'Favicon',
        width: 32,
        height: 32,
        formats: { thumbnail: { url: '/thumb.ico' } },
        provider: 'local',
      },
      logo: null,
      defaultSeo: {
        metaTitle: 'Default title',
        metaDescription: 'Default description',
        shareImage: null,
      },
    });

    expect(result).toEqual({
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
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

  it('omits missing media fields and sanitizes empty block arrays', () => {
    const input: StrapiGlobal = {
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
      analytics_script: [],
    };

    expect(mapGlobal(input)).toEqual({
      documentId: 'global-doc',
      siteName: 'TPB',
      siteDescription: 'Site description',
      analytics_script: [],
    });
  });

  it('handles null media relations and null block relations', () => {
    expect(
      mapGlobal({
        documentId: 'global-doc',
        siteName: 'TPB',
        siteDescription: 'Site description',
        favicon: null,
        logo: null,
        defaultSeo: {
          metaTitle: 'Default title',
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
