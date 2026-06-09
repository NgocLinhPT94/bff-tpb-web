import { ExecutionContext, MethodNotAllowedException } from '@nestjs/common';
import { NonGetMethodGuard } from './non-get-method.guard';

function mockContext(method: string, url: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ method, originalUrl: url, url }),
    }),
  } as unknown as ExecutionContext;
}

describe('NonGetMethodGuard', () => {
  let guard: NonGetMethodGuard;

  beforeEach(() => {
    guard = new NonGetMethodGuard();
  });

  it('allows GET on CMS routes', () => {
    expect(guard.canActivate(mockContext('GET', '/api/v1/articles'))).toBe(true);
  });

  it('allows OPTIONS on CMS routes', () => {
    expect(guard.canActivate(mockContext('OPTIONS', '/api/v1/articles'))).toBe(true);
  });

  it('throws MethodNotAllowedException for POST on CMS routes', () => {
    expect(() => guard.canActivate(mockContext('POST', '/api/v1/articles'))).toThrow(
      MethodNotAllowedException,
    );
  });

  it('throws MethodNotAllowedException for DELETE on CMS routes', () => {
    expect(() => guard.canActivate(mockContext('DELETE', '/api/v1/products'))).toThrow(
      MethodNotAllowedException,
    );
  });

  it('allows POST on /api/v1/lead (write route)', () => {
    expect(guard.canActivate(mockContext('POST', '/api/v1/lead'))).toBe(true);
  });

  it('allows POST on /api/v1/otp/send (write route)', () => {
    expect(guard.canActivate(mockContext('POST', '/api/v1/otp/send'))).toBe(true);
  });

  it('allows POST on /api/v1/captcha/verify (write route)', () => {
    expect(guard.canActivate(mockContext('POST', '/api/v1/captcha/verify'))).toBe(true);
  });

  it('allows POST on /api/v1/calculator/loan (write route)', () => {
    expect(guard.canActivate(mockContext('POST', '/api/v1/calculator/loan'))).toBe(true);
  });

  it('allows POST outside /api/v1 prefix', () => {
    expect(guard.canActivate(mockContext('POST', '/health'))).toBe(true);
  });
});
