import { Injectable } from '@nestjs/common';
import { RecaptchaClient } from '../../integrations/recaptcha/recaptcha.client';
import type { VerifyCaptchaDto, CaptchaResultDto } from './captcha.dto';

@Injectable()
export class CaptchaService {
  constructor(private readonly recaptchaClient: RecaptchaClient) {}

  async verify(_dto: VerifyCaptchaDto): Promise<CaptchaResultDto> {
    // TODO: implement using this.recaptchaClient.verifyToken(dto.token)
    throw new Error('Not implemented');
  }
}
