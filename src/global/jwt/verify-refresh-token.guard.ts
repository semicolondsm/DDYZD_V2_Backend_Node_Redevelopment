import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { VerifyTokenGuard } from './verify-token.guard';

@Injectable()
export class VerifyRefreshTokenGuard extends VerifyTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers['refresh-token']) {
      return false;
    }
    const payload = await this.validateToken(request.headers['refresh-token'] as string);
    request.user = payload;

    return payload.type === 'refresh';
  }
}
