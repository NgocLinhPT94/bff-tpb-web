import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import type { StrapiConfig } from '../../config/strapi.config';

interface StrapiGetOptions {
  params?: Record<string, string | number | boolean | undefined>;
}

@Injectable()
export class StrapiClient {
  private readonly retryAttempts: number;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    const config = configService.getOrThrow<StrapiConfig>('strapi');
    this.retryAttempts = Math.min(config.retryAttempts, 1);
  }

  async get<T>(path: string, options: StrapiGetOptions = {}): Promise<T> {
    this.assertRelativePath(path);

    const config: AxiosRequestConfig = {
      params: options.params,
    };

    for (let attempt = 0; attempt <= this.retryAttempts; attempt += 1) {
      try {
        const response = await this.httpService.axiosRef.get<T>(path, config);
        return response.data;
      } catch (error) {
        if (attempt < this.retryAttempts && this.isRetryable(error)) {
          continue;
        }

        throw this.translateError(error);
      }
    }

    throw new ServiceUnavailableException();
  }

  private assertRelativePath(path: string): void {
    if (!path.startsWith('/') || URL.canParse(path)) {
      throw new BadGatewayException();
    }
  }

  private isRetryable(error: unknown): boolean {
    if (!this.isAxiosError(error)) {
      return false;
    }

    if (this.isTimeout(error) || !error.response) {
      return true;
    }

    return [502, 503, 504].includes(error.response.status);
  }

  private translateError(error: unknown): Error {
    if (!this.isAxiosError(error)) {
      return new BadGatewayException();
    }

    if (this.isTimeout(error)) {
      return new GatewayTimeoutException();
    }

    const status = error.response?.status;

    if (status === 404) {
      return new NotFoundException();
    }

    if (status !== undefined && status >= 500) {
      return new BadGatewayException();
    }

    if (!error.response) {
      return new ServiceUnavailableException();
    }

    return new BadGatewayException();
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return error instanceof AxiosError;
  }

  private isTimeout(error: AxiosError): boolean {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
  }
}
