import type { CmsNavigation } from '../../infrastructure/strapi/cms-types';
import { mapNavigation, type NavigationMapperInput } from './navigation.mapper';

describe('mapNavigation', () => {
  it('maps null relations to empty arrays', () => {
    expect(
      mapNavigation({
        documentId: 'nav-doc',
        name: 'Header',
        navigation_items: null,
        iconshare: null,
        ButtonShare: null,
      } satisfies NavigationMapperInput),
    ).toEqual({
      documentId: 'nav-doc',
      name: 'Header',
      navigation_items: [],
      iconshare: [],
      ButtonShare: [],
    });
  });

  it('maps empty relation arrays', () => {
    const input = {
      documentId: 'nav-doc',
      id: 1,
      publishedAt: '2026-06-05T00:00:00.000Z',
      navigation_items: [],
      iconshare: [],
      ButtonShare: [],
    } satisfies CmsNavigation;

    expect(mapNavigation(input)).toEqual({
      documentId: 'nav-doc',
      navigation_items: [],
      iconshare: [],
      ButtonShare: [],
    });
  });

  it('summarizes navigation items and omits missing media fields', () => {
    const input = {
      documentId: 'nav-doc',
      id: 1,
      publishedAt: '2026-06-05T00:00:00.000Z',
      type_menu: 'header',
      on_off: true,
      navigation_items: [
        {
          documentId: 'item-doc',
          id: 1,
          publishedAt: '2026-06-05T00:00:00.000Z',
          title: 'Home',
          url: '/',
          order: 1,
        },
      ],
      iconshare: [
        {
          label: 'Facebook',
          url: 'https://example.com',
          external: true,
        },
      ],
    } satisfies CmsNavigation;

    expect(mapNavigation(input)).toEqual({
      documentId: 'nav-doc',
      type_menu: 'header',
      on_off: true,
      navigation_items: [
        {
          documentId: 'item-doc',
          title: 'Home',
          url: '/',
          order: 1,
        },
      ],
      iconshare: [
        {
          label: 'Facebook',
          url: 'https://example.com',
          external: true,
        },
      ],
      ButtonShare: [],
    });
  });
});
