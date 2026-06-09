import { mapTag } from './tags.mapper';
import type { CmsTag } from './tags.mapper';

describe('mapTag', () => {
  it('maps tag fields correctly', () => {
    const tag: CmsTag = {
      id: 1,
      documentId: 'tag-1',
      name: 'Digital Banking',
      slug: 'digital-banking',
      publishedAt: '2026-01-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      articles: [{ documentId: 'article-back-ref' } as CmsTag],
      products: [],
      promotions: [],
    };

    expect(mapTag(tag)).toEqual({
      documentId: 'tag-1',
      name: 'Digital Banking',
      slug: 'digital-banking',
    });
  });
});
