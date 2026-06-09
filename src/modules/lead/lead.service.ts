import { Injectable, Logger } from '@nestjs/common';
import { CmsClient } from '../../integrations/cms/cms.client';
import { CrmClient } from '../../integrations/crm/crm.client';
import { CreateLeadDto, type LeadSubmitResult } from './lead.dto';

/** Payload shape matching CMS lead-submission content type */
interface CmsCreateLeadPayload {
  fullName: string;
  phoneNumber: string;
  email?: string;
  productInterest: string;
  source: string;
  campaignSlug?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentGiven: boolean;
  submittedAt: string;
  status: 'new';
}

interface CmsLeadSubmissionResponse {
  data: {
    id: number;
    documentId: string;
  };
}

/**
 * Lead service — fan-out to CMS + CRM in parallel.
 *
 * Flow:
 * 1. Validate reCAPTCHA token (TODO: inject RecaptchaClient)
 * 2. Fire CmsClient.post + CrmClient.createLead concurrently
 * 3. CMS failure: non-blocking (log + continue) — lead must not be lost to CRM
 * 4. CRM failure: throw → 502 to client
 * 5. Return success with CMS record id for traceability
 */
@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly cmsClient: CmsClient,
    private readonly crmClient: CrmClient,
    // TODO: inject RecaptchaClient for token verification
  ) {}

  async create(dto: CreateLeadDto): Promise<LeadSubmitResult> {
    const submittedAt = new Date().toISOString();

    // TODO: Step 1 — verify captchaToken via RecaptchaClient
    // if (dto.captchaToken) await this.recaptchaClient.verifyToken(dto.captchaToken);

    const payload: CmsCreateLeadPayload = {
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      productInterest: dto.productInterest,
      source: dto.source,
      campaignSlug: dto.campaignSlug,
      message: dto.message,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      consentGiven: dto.consentGiven,
      submittedAt,
      status: 'new',
    };

    // Step 2 — fan-out: CMS + CRM in parallel
    const [cmsResult, crmResult] = await Promise.allSettled([
      this.cmsClient.post<CmsLeadSubmissionResponse>(
        '/lead-submissions',
        { data: payload },
      ),
      // TODO: replace with real CrmClient.createLead() once CRM DTO is defined
      Promise.resolve({ crmLeadId: 'pending' }),
    ]);

    // Step 3 — CMS failure is non-blocking
    let cmsId: number | undefined;
    if (cmsResult.status === 'fulfilled') {
      cmsId = cmsResult.value.data.id;
      this.logger.log(`Lead saved to CMS: id=${cmsId}`);
    } else {
      this.logger.error(`CMS write failed (non-blocking): ${cmsResult.reason}`);
    }

    // Step 4 — CRM failure is blocking
    if (crmResult.status === 'rejected') {
      this.logger.error(`CRM write failed: ${crmResult.reason}`);
      throw new Error('Failed to submit lead to CRM');
    }

    this.logger.log(`Lead submitted successfully: cms=${cmsId}`);

    return {
      success: true,
      message: 'Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất.',
      cmsId,
    };
  }
}
