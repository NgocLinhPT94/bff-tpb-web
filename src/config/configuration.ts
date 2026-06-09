/**
 * @nestjs/config factory function.
 * Loads configuration from environment variables.
 * Local: .env — Deployed: ConfigMap/Secret via External Secrets Operator.
 */
export const configuration = () => ({
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  environment: process.env['NODE_ENV'] ?? 'development',
  enableSwagger: process.env['ENABLE_SWAGGER'] === 'true',

  // Core Bank integration
  coreBank: {
    baseUrl: process.env['CORE_BANK_BASE_URL'] ?? '',
    apiKey: process.env['CORE_BANK_API_KEY'] ?? '',
    timeout: parseInt(process.env['CORE_BANK_TIMEOUT'] ?? '5000', 10),
  },

  // CRM integration
  crm: {
    baseUrl: process.env['CRM_BASE_URL'] ?? '',
    apiKey: process.env['CRM_API_KEY'] ?? '',
    timeout: parseInt(process.env['CRM_TIMEOUT'] ?? '5000', 10),
  },

  // SMS Gateway integration
  smsGateway: {
    baseUrl: process.env['SMS_GATEWAY_BASE_URL'] ?? '',
    apiKey: process.env['SMS_GATEWAY_API_KEY'] ?? '',
    senderId: process.env['SMS_GATEWAY_SENDER_ID'] ?? 'TPBank',
    timeout: parseInt(process.env['SMS_GATEWAY_TIMEOUT'] ?? '5000', 10),
  },

  // CMS integration
  cms: {
    baseUrl: process.env['CMS_BASE_URL'] ?? 'http://localhost:1337',
    apiToken: process.env['CMS_API_TOKEN'] ?? '',
    timeout: parseInt(process.env['CMS_TIMEOUT'] ?? '5000', 10),
    retryAttempts: parseInt(process.env['CMS_RETRY_ATTEMPTS'] ?? '1', 10),
  },

  // reCAPTCHA integration
  recaptcha: {
    secretKey: process.env['RECAPTCHA_SECRET_KEY'] ?? '',
    verifyUrl:
      process.env['RECAPTCHA_VERIFY_URL'] ??
      'https://www.google.com/recaptcha/api/siteverify',
    scoreThreshold: parseFloat(process.env['RECAPTCHA_SCORE_THRESHOLD'] ?? '0.5'),
  },

  // OTP
  otp: {
    expirySeconds: parseInt(process.env['OTP_EXPIRY_SECONDS'] ?? '300', 10),
    maxAttempts: parseInt(process.env['OTP_MAX_ATTEMPTS'] ?? '3', 10),
  },

  // Rate limiting
  rateLimit: {
    ttl: parseInt(process.env['RATE_LIMIT_TTL'] ?? '60', 10),
    limit: parseInt(process.env['RATE_LIMIT_MAX'] ?? '100', 10),
  },

  // CORS
  cors: {
    origins: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000').split(','),
  },

  // Preview Mode (shared secret between FE and BFF)
  feInternalSecret: process.env['FE_INTERNAL_SECRET'] ?? '',

  // Logging
  logLevel: process.env['LOG_LEVEL'] ?? 'debug',
});
