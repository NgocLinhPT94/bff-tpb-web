import type { CmsAuthor } from '../../infrastructure/strapi/cms-types';
import { mapAuthor } from './authors.mapper';

describe('authors mapper', () => {
  it('maps public author fields and avatar media', () => {
    const input = {
      id: 1,
      documentId: 'author-1',
      name: 'Jane Writer',
      email: 'jane@example.com',
      createdAt: '2026-05-11T00:00:00.000Z',
      publishedAt: '2026-06-05T00:00:00.000Z',
      avatar: {
        id: 10,
        documentId: 'media-1',
        name: 'avatar.png',
        url: '/uploads/avatar.png',
        alternativeText: 'Avatar',
        width: 128,
        height: 128,
        hash: 'avatar',
        mime: 'image/png',
        size: 12.8,
        provider: 'local',
        publishedAt: '2026-06-05T00:00:00.000Z',
        related: [],
      },
    } satisfies CmsAuthor;

    const result = mapAuthor(input);

    expect(result).toEqual({
      documentId: 'author-1',
      name: 'Jane Writer',
      email: 'jane@example.com',
      avatar: {
        url: '/uploads/avatar.png',
        alternativeText: 'Avatar',
        width: 128,
        height: 128,
      },
    });
  });

  it('handles null avatar relation, empty article back-reference, and missing media', () => {
    expect(
      mapAuthor({
        id: 2,
        documentId: 'author-2',
        name: 'No Avatar',
        publishedAt: '2026-06-05T00:00:00.000Z',
        avatar: null,
        articles: [],
      }),
    ).toEqual({
      documentId: 'author-2',
      name: 'No Avatar',
      avatar: null,
    });

    expect(
      mapAuthor({
        id: 3,
        documentId: 'author-3',
        publishedAt: '2026-06-05T00:00:00.000Z',
        articles: [],
      }),
    ).toEqual({ documentId: 'author-3' });
  });
});
