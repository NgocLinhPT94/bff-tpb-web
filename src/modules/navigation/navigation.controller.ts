import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import { createSuccessEnvelope } from '../../common/utils/response-envelope';
import type { NavigationDto } from './navigation.dto';
import { NavigationService } from './navigation.service';

@ApiTags('Navigation')
@Controller('navigations')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all navigation structures with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of navigation structures retrieved successfully',
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
  ): Promise<SuccessEnvelopeDto<NavigationDto[]>> {
    const response = await this.navigationService.findAll(query);
    return createSuccessEnvelope(request, response.data, response.pagination);
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single navigation structure by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Navigation document ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Navigation structure retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid document ID',
    type: ErrorEnvelopeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Navigation not found',
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
  ): Promise<SuccessEnvelopeDto<NavigationDto>> {
    return createSuccessEnvelope(
      request,
      await this.navigationService.findOne(documentId),
    );
  }
}
