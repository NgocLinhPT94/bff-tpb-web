import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import type { RequestWithId } from '../../common/http/request-with-id';
import { EmptyQueryDto, ListQueryDto } from '../../common/query';
import { buildListMeta, buildRequestMeta } from '../shared/response-envelope';
import type { NavigationDto } from './navigation.mapper';
import { NavigationService } from './navigation.service';
import { NavigationDto as NavigationSwaggerDto } from './navigation.swagger.dto';

@ApiTags('Navigation')
@Controller('navigations')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all navigation structures with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of navigation structures retrieved successfully',
    type: () => SuccessEnvelopeDto<NavigationSwaggerDto[]>,
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
    return new SuccessEnvelopeDto(
      response.data,
      buildListMeta(request, response),
    );
  }

  @Get(':documentId')
  @ApiOperation({ summary: 'Get a single navigation structure by document ID' })
  @ApiParam({
    name: 'documentId',
    description: 'Navigation document ID',
    example: 'nav-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Navigation structure retrieved successfully',
    type: () => SuccessEnvelopeDto<NavigationSwaggerDto>,
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
    const data = await this.navigationService.findOne(documentId);
    return new SuccessEnvelopeDto(data, buildRequestMeta(request));
  }
}
