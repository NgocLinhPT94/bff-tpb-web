import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { PromotionDto } from './promotions.dto';
import { PromotionsService } from './promotions.service';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all promotions with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of promotions retrieved successfully',
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
  ): Promise<SuccessEnvelopeDto<PromotionDto[]>> {
    const response = await this.promotionsService.findAll(query);

    return createSuccessEnvelope(
      request,
      response.data,
      response.pagination,
    );
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single promotion by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Promotion document ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Promotion retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Promotion not found',
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
  ): Promise<SuccessEnvelopeDto<PromotionDto>> {
    const promotion = await this.promotionsService.findOne(documentId);

    return createSuccessEnvelope(request, promotion);
  }
}
