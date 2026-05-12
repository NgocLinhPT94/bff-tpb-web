import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import type { RequestWithId } from '../http/request-with-id';

@Injectable()
export class NonGetMethodGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const path = request.originalUrl ?? request.url;

    if (
      path.startsWith('/api/v1') &&
      request.method !== 'GET' &&
      request.method !== 'OPTIONS'
    ) {
      throw new MethodNotAllowedException();
    }

    return true;
  }
}
