import { mapNavigation } from './navigation.mapper';

describe('mapNavigation', () => {
  it('maps null relations to empty arrays', () => {
    expect(
      mapNavigation({
        documentId: 'nav-doc',
        name: 'Header',
        navigation_items: null,
        iconshare: null,
        ButtonShare: null,
      }),
    ).toEqual({
      documentId: 'nav-doc',
      name: 'Header',
      navigation_items: [],
      iconshare: [],
      ButtonShare: [],
    });
  });

  it('maps empty relation arrays', () => {
    expect(
      mapNavigation({
        documentId: 'nav-doc',
        navigation_items: [],
        iconshare: [],
        ButtonShare: [],
      }),
    ).toEqual({
      documentId: 'nav-doc',
      navigation_items: [],
      iconshare: [],
      ButtonShare: [],
    });
  });

  it('summarizes navigation items and omits missing media fields', () => {
    expect(
      mapNavigation({
        documentId: 'nav-doc',
        type_menu: 'header',
        on_off: true,
        navigation_items: [
          {
            documentId: 'item-doc',
            id: 1,
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
            icon: {
              url: '/facebook.svg',
              alternativeText: 'Facebook',
              provider: 'local',
            },
          },
        ],
      }),
    ).toEqual({
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
          icon: {
            url: '/facebook.svg',
            alternativeText: 'Facebook',
          },
        },
      ],
      ButtonShare: [],
    });
  });
});
