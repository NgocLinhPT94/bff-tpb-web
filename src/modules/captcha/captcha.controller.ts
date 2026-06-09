import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { VerifyCaptchaDto, CaptchaResultDto } from './captcha.dto';

@ApiTags('Captcha')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify reCAPTCHA token' })
  @ApiResponse({ status: 200, description: 'Token verified', type: CaptchaResultDto })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  async verify(@Body() dto: VerifyCaptchaDto): Promise<CaptchaResultDto> {
    return this.captchaService.verify(dto);
  }
}
