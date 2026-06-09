import { PageTemplate, PageWorkflowState } from './pages.dto';
import { mapPage } from './pages.mapper';

describe('mapPage', () => {
  it('maps null dynamic-zone relation to an empty array', () => {
    expect(
      mapPage({ documentId: 'page-doc', title: 'Home', sections: null }),
    ).toEqual({ documentId: 'page-doc', title: 'Home', sections: [] });
  });

  it('maps empty dynamic-zone arrays', () => {
    expect(mapPage({ documentId: 'page-doc', sections: [] })).toEqual({
      documentId: 'page-doc',
      sections: [],
    });
  });

  it('preserves component names and strips internal metadata from dynamic zones', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        slug: 'home',
        sections: [
          {
            id: 1,
            __component: 'blocks.cta-banner',
            title: 'Apply now',
            createdAt: 'internal',
          },
        ],
      }),
    ).toEqual({
      documentId: 'page-doc',
      slug: 'home',
      sections: [{ __component: 'blocks.cta-banner', title: 'Apply now' }],
    });
  });

  it('handles sections with missing media fields', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        sections: [{ __component: 'blocks.product-highlight', title: 'Loans' }],
      }),
    ).toEqual({
      documentId: 'page-doc',
      sections: [{ __component: 'blocks.product-highlight', title: 'Loans' }],
    });
  });

  it('passes through valid template and workflowState enum values', () => {
    expect(
      mapPage({
        documentId: 'page-doc',
        template: 'landing',
        workflowState: 'published',
        sections: [],
      }),
    ).toEqual({
      documentId: 'page-doc',
      template: PageTemplate.LANDING,
      workflowState: PageWorkflowState.PUBLISHED,
      sections: [],
    });
  });

  it('drops unknown enum values', () => {
    expect(
      mapPage({ documentId: 'page-doc', template: 'unknown', sections: [] }),
    ).toEqual({ documentId: 'page-doc', sections: [] });
  });
});
