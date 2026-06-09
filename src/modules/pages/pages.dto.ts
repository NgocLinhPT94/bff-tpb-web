export enum PageTemplate {
  DEFAULT = 'default',
  HOME = 'home',
  PERSONAL = 'personal',
  LANDING = 'landing',
}

export enum PageWorkflowState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export const PAGE_SECTION_COMPONENTS = [
  'blocks.rich-text',
  'blocks.product-highlight',
  'blocks.news-block',
  'blocks.feature-grid',
  'blocks.faq-block',
  'blocks.cta-banner',
  'shared.slider',
  'blocks.banners-main',
] as const;

export type PageSectionComponent = (typeof PAGE_SECTION_COMPONENTS)[number];

export interface PageDto {
  documentId: string;
  title?: string;
  description?: string;
  slug?: string;
  template?: PageTemplate;
  workflowState?: PageWorkflowState;
  publishDate?: string;
  sections: unknown[];
}
