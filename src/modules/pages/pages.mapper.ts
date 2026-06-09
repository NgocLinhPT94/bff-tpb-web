import { removeUndefined, sanitizePublicValue, type CmsOperationData } from '../../common/utils/cms-mapper';
import {
  PageTemplate,
  PageWorkflowState,
  type PageDto,
} from './pages.dto';

export type CmsPage = CmsOperationData<'page/get/pages_by_id'>;

export type CmsPageListItem = CmsOperationData<'page/get/pages'>[number];

const PAGE_TEMPLATES = new Set<string>(Object.values(PageTemplate));
const PAGE_WORKFLOW_STATES = new Set<string>(Object.values(PageWorkflowState));

export function mapPage(page: CmsPage | CmsPageListItem): PageDto {
  return removeUndefined({
    documentId: page.documentId,
    title: page.title,
    description: page.description ?? undefined,
    slug: page.slug,
    template: mapEnum(page.template, PAGE_TEMPLATES) as PageTemplate | undefined,
    workflowState: mapEnum(page.workflowState, PAGE_WORKFLOW_STATES) as PageWorkflowState | undefined,
    publishDate: page.publishDate ?? undefined,
    sections: Array.isArray(page.sections)
      ? page.sections.map((section) => sanitizePublicValue(section))
      : [],
  });
}

function mapEnum(
  value: string | null | undefined,
  validValues: Set<string>,
): string | undefined {
  if (!value || !validValues.has(value)) {
    return undefined;
  }
  return value;
}
