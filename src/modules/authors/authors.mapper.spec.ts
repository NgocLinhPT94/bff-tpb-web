import { mapAuthor } from './authors.mapper';

describe('authors mapper', () => {
  it('maps public author fields and avatar media', () => {
    const result = mapAuthor({
      id: 1,
      documentId: 'author-1',
      name: 'Jane Writer',
      email: 'jane@example.com',
      createdAt: '2026-05-11T00:00:00.000Z',
      avatar: {
        id: 10,
        documentId: 'media-1',
        url: '/uploads/avatar.png',
        alternativeText: 'Avatar',
        width: 128,
        height: 128,
        provider: 'local',
      },
      articles: [{ documentId: 'article-back-ref' }],
    });

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
        documentId: 'author-2',
        name: 'No Avatar',
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
        documentId: 'author-3',
        articles: [],
      }),
    ).toEqual({ documentId: 'author-3' });
  });
});
