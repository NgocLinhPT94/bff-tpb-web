import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import type { RequestWithId } from '../http/request-with-id';

/**
 * Guard that blocks non-GET/OPTIONS methods on CMS content routes.
 * CMS content endpoints are read-only — only GET and OPTIONS are allowed.
 * Write endpoints (lead, otp, etc.) are excluded from this guard.
 */
@Injectable()
export class NonGetMethodGuard implements CanActivate {
  /** Routes that allow write methods (POST, PUT, etc.) */
  private readonly writeRoutes = ['/api/v1/lead', '/api/v1/otp', '/api/v1/captcha', '/api/v1/calculator'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const method = request.method;
    const path = request.originalUrl ?? request.url;

    // Allow GET and OPTIONS for all routes
    if (method === 'GET' || method === 'OPTIONS') {
      return true;
    }

    // Allow write methods for designated write routes
    if (this.writeRoutes.some((route) => path.startsWith(route))) {
      return true;
    }

    // Block all other write methods on CMS content routes
    if (path.startsWith('/api/v1')) {
      throw new MethodNotAllowedException();
    }

    return true;
  }
}
