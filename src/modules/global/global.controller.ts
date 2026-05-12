import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessEnvelopeDto, ErrorEnvelopeDto } from '../../common/dto';
import { EmptyQueryDto } from '../../common/query';
import type { RequestWithId } from '../../common/http/request-with-id';
import { buildRequestMeta } from '../shared/response-envelope';
import type { GlobalDto } from './global.mapper';
import { GlobalService } from './global.service';
import { GlobalDto as GlobalSwaggerDto } from './global.swagger.dto';

@ApiTags('Global')
@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Get()
  @ApiOperation({ summary: 'Get global site settings' })
  @ApiResponse({
    status: 200,
    description: 'Global settings retrieved successfully',
    type: () => SuccessEnvelopeDto<GlobalSwaggerDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Global settings not found',
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
    @Query() _query: EmptyQueryDto,
    @Req() request: RequestWithId,
  ): Promise<SuccessEnvelopeDto<GlobalDto>> {
    const data = await this.globalService.findOne();
    return new SuccessEnvelopeDto(data, buildRequestMeta(request));
  }
}
