import type { CmsNavigationItem } from '../../infrastructure/strapi/cms-types';
import {
  mapNavigationItem,
  type NavigationItemMapperInput,
} from './navigation-item.mapper';

describe('mapNavigationItem', () => {
  it('maps null relations to omitted summaries and empty children', () => {
    expect(
      mapNavigationItem({
        documentId: 'item-doc',
        title: 'Home',
        navigation: null,
        parent: null,
        children: null,
      } satisfies NavigationItemMapperInput),
    ).toEqual({
      documentId: 'item-doc',
      title: 'Home',
      children: [],
    });
  });

  it('maps empty children arrays', () => {
    const input = {
      documentId: 'item-doc',
      id: 1,
      publishedAt: '2026-06-05T00:00:00.000Z',
      children: [],
    } satisfies CmsNavigationItem;

    expect(mapNavigationItem(input)).toEqual({
      documentId: 'item-doc',
      children: [],
    });
  });

  it('omits missing media and strips back-reference collections from relation summaries', () => {
    expect(
      mapNavigationItem({
        documentId: 'item-doc',
        icon: null,
        navigation: {
          documentId: 'nav-doc',
          name: 'Header',
          navigation_items: [
            { documentId: 'other-item', id: 1, publishedAt: '2024-01-01' },
          ],
        },
        parent: {
          documentId: 'parent-doc',
          title: 'Parent',
          children: [{ documentId: 'child-doc' }],
        },
      } satisfies NavigationItemMapperInput),
    ).toEqual({
      documentId: 'item-doc',
      navigation: { documentId: 'nav-doc', name: 'Header' },
      parent: { documentId: 'parent-doc', title: 'Parent' },
      children: [],
    });
  });

  it('caps recursive child mapping depth at five levels', () => {
    const root = buildChain(7);
    const result = mapNavigationItem(root);

    expect(
      result.children[0]?.children[0]?.children[0]?.children[0]?.children[0],
    ).toEqual({
      documentId: 'item-5',
      children: [],
    });
  });

  it('drops cyclic child references', () => {
    const root: NavigationItemMapperInput = { documentId: 'root' };
    root.children = [{ documentId: 'child', children: [root] }];

    expect(mapNavigationItem(root)).toEqual({
      documentId: 'root',
      children: [{ documentId: 'child', children: [] }],
    });
  });
});

function buildChain(length: number): NavigationItemMapperInput {
  const root: NavigationItemMapperInput = { documentId: 'item-0' };
  let current = root;

  for (let index = 1; index < length; index += 1) {
    const child: NavigationItemMapperInput = { documentId: `item-${index}` };
    current.children = [child];
    current = child;
  }

  return root;
}
