import { envSchema } from './env.schema';

describe('envSchema validation', () => {
  it('accepts a valid environment and coerces numeric values', () => {
    const { error, value } = envSchema.validate({
      PORT: '4000',
      NODE_ENV: 'production',
      CMS_BASE_URL: 'https://cms.example.com/api',
      CMS_API_TOKEN: 'token',
      CMS_TIMEOUT: '3000',
      CMS_RETRY_ATTEMPTS: '1',
      CORS_ORIGINS: 'https://tpb.example.com',
      RATE_LIMIT_TTL: '120',
      RATE_LIMIT_MAX: '50',
    });

    expect(error).toBeUndefined();
    expect(value).toMatchObject({
      PORT: 4000,
      NODE_ENV: 'production',
      CMS_BASE_URL: 'https://cms.example.com/api',
      CMS_RETRY_ATTEMPTS: 1,
      RATE_LIMIT_TTL: 120,
      RATE_LIMIT_MAX: 50,
    });
  });

  it('rejects invalid NODE_ENV values', () => {
    const { error } = envSchema.validate({
      NODE_ENV: 'staging',
    });

    expect(error).toBeDefined();
    expect(error!.message).toContain('NODE_ENV');
  });

  it('rejects invalid CMS_BASE_URL (non-URI)', () => {
    const { error } = envSchema.validate({
      CMS_BASE_URL: 'not-a-url',
    });

    expect(error).toBeDefined();
    expect(error!.message).toContain('CMS_BASE_URL');
  });

  it('rejects CMS_RETRY_ATTEMPTS above max (1)', () => {
    const { error } = envSchema.validate({
      CMS_RETRY_ATTEMPTS: 2,
    });

    expect(error).toBeDefined();
    expect(error!.message).toContain('CMS_RETRY_ATTEMPTS');
  });

  it('rejects invalid LOG_LEVEL values', () => {
    const { error } = envSchema.validate({
      LOG_LEVEL: 'trace',
    });

    expect(error).toBeDefined();
    expect(error!.message).toContain('LOG_LEVEL');
  });

  it('rejects RECAPTCHA_SCORE_THRESHOLD outside 0-1 range', () => {
    const { error } = envSchema.validate({
      RECAPTCHA_SCORE_THRESHOLD: 1.5,
    });

    expect(error).toBeDefined();
    expect(error!.message).toContain('RECAPTCHA_SCORE_THRESHOLD');
  });

  it('applies defaults when no variables are provided', () => {
    const { error, value } = envSchema.validate({});

    expect(error).toBeUndefined();
    expect(value).toMatchObject({
      PORT: 3001,
      NODE_ENV: 'development',
      CMS_BASE_URL: 'http://localhost:1337',
      CMS_API_TOKEN: 'dev-placeholder',
      CMS_TIMEOUT: 5000,
      CMS_RETRY_ATTEMPTS: 1,
      RATE_LIMIT_TTL: 60,
      RATE_LIMIT_MAX: 100,
      LOG_LEVEL: 'debug',
      FE_INTERNAL_SECRET: '',
    });
  });

  it('allows unknown environment variables (allowUnknown)', () => {
    const { error } = envSchema.validate({
      SOME_RANDOM_VAR: 'hello',
      ANOTHER_UNKNOWN: '123',
    });

    expect(error).toBeUndefined();
  });

  it('allows empty FE_INTERNAL_SECRET', () => {
    const { error } = envSchema.validate({
      FE_INTERNAL_SECRET: '',
    });

    expect(error).toBeUndefined();
  });
});
