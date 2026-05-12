import { Test } from '@nestjs/testing';
import { validate } from './validation';

describe('environment validation', () => {
  beforeEach(async () => {
    await Test.createTestingModule({}).compile();
  });

  it('accepts a valid environment and coerces numeric values', () => {
    expect(
      validate({
        PORT: '4000',
        NODE_ENV: 'test',
        STRAPI_BASE_URL: 'https://cms.example.com/api',
        STRAPI_API_TOKEN: 'token',
        CORS_ORIGINS: 'https://tpb.example.com',
        THROTTLE_TTL_MS: '1000',
        THROTTLE_LIMIT: '20',
        STRAPI_TIMEOUT_MS: '1500',
        STRAPI_RETRY_ATTEMPTS: '1',
      }),
    ).toMatchObject({
      PORT: 4000,
      NODE_ENV: 'test',
      STRAPI_BASE_URL: 'https://cms.example.com/api',
      STRAPI_RETRY_ATTEMPTS: 1,
    });
  });

  it('rejects invalid environment values', () => {
    expect(() =>
      validate({
        NODE_ENV: 'staging',
        STRAPI_BASE_URL: 'ftp://cms.example.com/api',
        THROTTLE_LIMIT: 0,
      }),
    ).toThrow('Environment validation failed');
  });

  it('rejects missing required variables', () => {
    expect(() => validate({})).toThrow('Environment validation failed');
  });

  it('applies defaults when optional variables are missing', () => {
    expect(
      validate({ STRAPI_BASE_URL: 'http://localhost:1337/api' }),
    ).toMatchObject({
      PORT: 3000,
      NODE_ENV: 'development',
      STRAPI_BASE_URL: 'http://localhost:1337/api',
      STRAPI_API_TOKEN: '',
      STRAPI_RETRY_ATTEMPTS: 1,
    });
  });
});
