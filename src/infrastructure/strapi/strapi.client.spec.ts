import {
  BadGatewayException,
  GatewayTimeoutException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosError, type AxiosResponse } from 'axios';
import { StrapiClient } from './strapi.client';

describe('StrapiClient', () => {
  let client: StrapiClient;
  let getMock: jest.Mock;

  beforeEach(async () => {
    getMock = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        StrapiClient,
        {
          provide: HttpService,
          useValue: { axiosRef: { get: getMock } },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue({ retryAttempts: 1 }),
          },
        },
      ],
    }).compile();

    client = moduleRef.get(StrapiClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('maps upstream 500 errors to 502', async () => {
    getMock.mockRejectedValueOnce(axiosHttpError(500));
    getMock.mockRejectedValueOnce(axiosHttpError(500));

    await expect(client.get('/articles')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('maps upstream timeouts to 504', async () => {
    getMock.mockRejectedValueOnce(axiosNetworkError('ETIMEDOUT'));
    getMock.mockRejectedValueOnce(axiosNetworkError('ETIMEDOUT'));

    await expect(client.get('/articles')).rejects.toBeInstanceOf(
      GatewayTimeoutException,
    );
  });

  it('maps upstream 404 errors to 404 without retrying', async () => {
    getMock.mockRejectedValueOnce(axiosHttpError(404));

    await expect(client.get('/articles/missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(getMock).toHaveBeenCalledTimes(1);
  });

  it('maps network errors to 503', async () => {
    getMock.mockRejectedValueOnce(axiosNetworkError('ECONNRESET'));
    getMock.mockRejectedValueOnce(axiosNetworkError('ECONNRESET'));

    await expect(client.get('/articles')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('retries retryable 502, 503, 504, and network errors once', async () => {
    for (const error of [
      axiosHttpError(502),
      axiosHttpError(503),
      axiosHttpError(504),
      axiosNetworkError('ECONNRESET'),
    ]) {
      getMock.mockRejectedValueOnce(error);
      getMock.mockResolvedValueOnce({ data: { ok: true } });

      await expect(client.get('/articles')).resolves.toEqual({ ok: true });
    }

    expect(getMock).toHaveBeenCalledTimes(8);
  });
});

function axiosHttpError(status: number): AxiosError {
  return new AxiosError(
    `Request failed with status code ${status}`,
    undefined,
    undefined,
    undefined,
    {
      data: { error: { message: 'raw upstream detail' } },
      status,
      statusText: 'Error',
      headers: {},
      config: { headers: {} },
    } as unknown as AxiosResponse,
  );
}

function axiosNetworkError(code: string): AxiosError {
  return new AxiosError('Network error', code);
}
