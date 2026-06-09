import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, type AxiosRequestConfig } from 'axios';

export interface CmsGetOptions {
  params?: Record<string, string | number | boolean | undefined>;
  isDraft?: boolean;
}

export interface CmsPostOptions {
  timeout?: number;
}

/**
 * CMS HTTP client — handles all communication with tpb-web-cms.
 *
 * Features:
 * - GET with retry on transient errors (502, 503, 504, timeout)
 * - POST for write operations (lead submissions, etc.)
 * - Error translation to NestJS HTTP exceptions
 * - Preview/draft mode support
 * - Path validation (relative only)
 *
 * Used by:
 * - CMS content modules for read (articles, products, pages, etc.)
 * - Lead module for write (lead submissions)
 */
@Injectable()
export class CmsClient {
  private readonly logger = new Logger(CmsClient.name);
  private readonly retryAttempts: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.retryAttempts = Math.min(
      this.configService.get<number>('cms.retryAttempts') ?? 1,
      1,
    );
  }

  /**
   * GET request to CMS.
   * Automatically retries on transient failures and translates errors.
   */
  async get<T>(path: string, options: CmsGetOptions = {}): Promise<T> {
    this.assertRelativePath(path);

    const params = { ...options.params };

    // Add status=draft for preview mode
    if (options.isDraft) {
      params['status'] = 'draft';
    }

    const config: AxiosRequestConfig = { params };

    for (let attempt = 0; attempt <= this.retryAttempts; attempt += 1) {
      try {
        const response = await this.httpService.axiosRef.get<T>(path, config);
        return response.data;
      } catch (error) {
        if (attempt < this.retryAttempts && this.isRetryable(error)) {
          this.logger.warn(
            `CMS request failed (attempt ${attempt + 1}/${this.retryAttempts + 1}), retrying: ${path}`,
          );
          continue;
        }

        throw this.translateError(error, path);
      }
    }

    throw new ServiceUnavailableException('CMS service unavailable after retries');
  }

  /**
   * POST request to CMS.
   * Used for write operations (e.g., creating lead submissions).
   * Does NOT retry — write operations should not be retried automatically.
   */
  async post<T>(path: string, data: unknown, options: CmsPostOptions = {}): Promise<T> {
    this.assertRelativePath(path);

    try {
      const response = await this.httpService.axiosRef.post<T>(path, data, {
        timeout: options.timeout,
      });
      return response.data;
    } catch (error) {
      throw this.translateError(error, path);
    }
  }

  private assertRelativePath(path: string): void {
    if (!path.startsWith('/') || URL.canParse(path)) {
      throw new BadGatewayException('Invalid CMS path: must be relative');
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

  private translateError(error: unknown, path: string): Error {
    if (!this.isAxiosError(error)) {
      this.logger.error(`Non-Axios error calling CMS: ${path}`);
      return new BadGatewayException('CMS communication error');
    }

    if (this.isTimeout(error)) {
      this.logger.warn(`CMS timeout: ${path}`);
      return new GatewayTimeoutException('CMS request timed out');
    }

    const status = error.response?.status;

    if (status === 404) {
      return new NotFoundException();
    }

    if (status !== undefined && status >= 500) {
      this.logger.error(`CMS ${status} error: ${path}`);
      return new BadGatewayException('CMS upstream error');
    }

    if (!error.response) {
      this.logger.error(`CMS unreachable: ${path}`);
      return new ServiceUnavailableException('CMS service unreachable');
    }

    this.logger.error(`CMS unexpected ${status} error: ${path}`);
    return new BadGatewayException('CMS communication error');
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return error instanceof AxiosError;
  }

  private isTimeout(error: AxiosError): boolean {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
  }
}
