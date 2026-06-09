import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  OtpSendResultDto,
  OtpVerifyResultDto,
} from './otp.dto';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully', type: OtpSendResultDto })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async sendOtp(@Body() dto: SendOtpDto): Promise<OtpSendResultDto> {
    return this.otpService.send(dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verification result', type: OtpVerifyResultDto })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<OtpVerifyResultDto> {
    return this.otpService.verify(dto);
  }
}
