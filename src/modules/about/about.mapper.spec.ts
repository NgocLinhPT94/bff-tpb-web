import { mapAbout } from './about.mapper';

describe('mapAbout', () => {
  it('maps null dynamic zone relation to an empty array', () => {
    expect(
      mapAbout({ documentId: 'about-doc', title: 'About', blocks: null }),
    ).toEqual({
      documentId: 'about-doc',
      title: 'About',
      blocks: [],
    });
  });

  it('maps empty dynamic zone arrays', () => {
    expect(mapAbout({ documentId: 'about-doc', blocks: [] })).toEqual({
      documentId: 'about-doc',
      blocks: [],
    });
  });

  it('preserves component names and strips internal metadata from blocks', () => {
    expect(
      mapAbout({
        documentId: 'about-doc',
        blocks: [
          {
            id: 7,
            __component: 'shared.rich-text',
            body: 'Hello',
            createdAt: 'internal',
          },
        ],
      }),
    ).toEqual({
      documentId: 'about-doc',
      blocks: [{ __component: 'shared.rich-text', body: 'Hello' }],
    });
  });

  it('handles missing media fields inside blocks', () => {
    expect(
      mapAbout({
        documentId: 'about-doc',
        blocks: [
          { __component: 'shared.hero', image: null, title: 'About TPB' },
        ],
      }),
    ).toEqual({
      documentId: 'about-doc',
      blocks: [{ __component: 'shared.hero', image: null, title: 'About TPB' }],
    });
  });
});
