import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { RequestWithId } from '../../common/http/request-with-id';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import { LeadService } from './lead.service';
import { CreateLeadDto, type LeadSubmitResult } from './lead.dto';

/**
 * Lead controller — handles HTTP concerns for lead submission.
 * Delegates all business logic to LeadService.
 * LeadService fans out to CMS + CRM via integration adapters.
 */
@ApiTags('Lead')
@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a new lead — fans out to CMS + CRM' })
  @ApiResponse({ status: 201, description: 'Lead submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation error', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded', type: ErrorEnvelopeDto })
  @ApiResponse({ status: 502, description: 'Upstream service error', type: ErrorEnvelopeDto })
  async submitLead(
    @Body() createLeadDto: CreateLeadDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<LeadSubmitResult>> {
    const result = await this.leadService.create(createLeadDto);
    return createSuccessEnvelope(request, result);
  }
}
