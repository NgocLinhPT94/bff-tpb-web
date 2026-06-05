import type { CmsAbout } from '../../infrastructure/strapi/cms-types';
import { mapAbout } from './about.mapper';

describe('mapAbout', () => {
  it('maps null dynamic zone relation to an empty array', () => {
    const input = {
      documentId: 'about-doc',
      id: 1,
      title: 'About',
      publishedAt: '2026-06-05T00:00:00.000Z',
      blocks: null,
    };

    expect(mapAbout(input)).toEqual({
      documentId: 'about-doc',
      title: 'About',
      blocks: [],
    });
  });

  it('maps empty dynamic zone arrays and omits missing optional text', () => {
    const input = {
      documentId: 'about-doc',
      id: 1,
      publishedAt: '2026-06-05T00:00:00.000Z',
      blocks: [],
    } satisfies CmsAbout;

    expect(mapAbout(input)).toEqual({
      documentId: 'about-doc',
      blocks: [],
    });
  });

  it('preserves unknown component fallback names and sanitizes nested metadata', () => {
    expect(
      mapAbout({
        documentId: 'about-doc',
        id: 1,
        publishedAt: '2026-06-05T00:00:00.000Z',
        blocks: [
          {
            id: 7,
            __component: 'blocks.unregistered-experiment',
            title: 'Fallback block',
            media: {
              id: 8,
              url: '/fallback.jpg',
              alternativeText: 'Fallback',
              provider: 'local',
              related: [],
            },
          },
        ],
      } satisfies CmsAbout),
    ).toEqual({
      documentId: 'about-doc',
      blocks: [
        {
          __component: 'blocks.unregistered-experiment',
          title: 'Fallback block',
          media: {
            url: '/fallback.jpg',
            alternativeText: 'Fallback',
          },
        },
      ],
    });
  });

  it('preserves component names and strips internal metadata from blocks', () => {
    expect(
      mapAbout({
        documentId: 'about-doc',
        id: 1,
        publishedAt: '2026-06-05T00:00:00.000Z',
        blocks: [
          {
            id: 7,
            __component: 'shared.rich-text',
            body: 'Hello',
            createdAt: 'internal',
          },
        ],
      } satisfies CmsAbout),
    ).toEqual({
      documentId: 'about-doc',
      blocks: [{ __component: 'shared.rich-text', body: 'Hello' }],
    });
  });

  it('handles missing media fields inside blocks', () => {
    expect(
      mapAbout({
        documentId: 'about-doc',
        id: 1,
        publishedAt: '2026-06-05T00:00:00.000Z',
        blocks: [
          { __component: 'shared.hero', image: null, title: 'About TPB' },
        ],
      } satisfies CmsAbout),
    ).toEqual({
      documentId: 'about-doc',
      blocks: [{ __component: 'shared.hero', image: null, title: 'About TPB' }],
    });
  });
});
