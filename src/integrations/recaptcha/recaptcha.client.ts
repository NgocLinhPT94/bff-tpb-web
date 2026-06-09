import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

/**
 * reCAPTCHA HTTP adapter — handles all communication with Google reCAPTCHA API.
 * This is the ONLY place that makes HTTP calls to reCAPTCHA.
 * Business modules inject this client via DI and never call reCAPTCHA directly.
 *
 * Responsibilities:
 * - Token verification with Google reCAPTCHA API
 * - Error mapping (external errors -> domain exceptions)
 * - Score threshold evaluation
 */
@Injectable()
export class RecaptchaClient {
  private readonly secretKey: string;
  private readonly verifyUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.getOrThrow<string>('recaptcha.secretKey');
    this.verifyUrl =
      this.configService.get<string>('recaptcha.verifyUrl') ??
      'https://www.google.com/recaptcha/api/siteverify';
  }

  // TODO: Implement reCAPTCHA verification
  // async verifyToken(token: string, remoteIp?: string): Promise<RecaptchaVerifyResponseDto> { ... }
}
