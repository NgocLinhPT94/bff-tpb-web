import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import { FaqsService } from './faqs.service';
import type { FaqDto } from './faqs.dto';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all FAQs with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of FAQs retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 502,
    description: 'Bad gateway - CMS unavailable',
    type: ErrorEnvelopeDto,
  })
  async findAll(
    @Query() query: ListQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<FaqDto[]>> {
    const response = await this.faqsService.findAll(query);
    return createSuccessEnvelope(request, response.data, response.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single FAQ by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'FAQ document ID',
  })
  @ApiResponse({
    status: 200,
    description: 'FAQ retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'FAQ not found',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Method not allowed',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 502,
    description: 'Bad gateway - CMS unavailable',
    type: ErrorEnvelopeDto,
  })
  async findOne(
    @Param('documentId') documentId: string,
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<FaqDto>> {
    return createSuccessEnvelope(
      request,
      await this.faqsService.findOne(documentId),
    );
  }
}
