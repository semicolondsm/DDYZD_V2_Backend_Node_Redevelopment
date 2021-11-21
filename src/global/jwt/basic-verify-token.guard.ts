import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { VerifyTokenGuard } from './verify-token.guard';

@Injectable()
export class BasicVerifyTokenGuard extends VerifyTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.headers['authorization']) {
            return false;
        }
        const payload = await this.validateToken(request.headers.authorization);
        request.user = payload;

        return payload.type === 'access';
    }
}
