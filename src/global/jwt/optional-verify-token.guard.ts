import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { VerifyTokenGuard } from './verify-token.guard';

@Injectable()
export class OptionalVerifyTokenGuard extends VerifyTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        if (request.headers['authorization']) {
            try {
                request.user = await this.validateToken(
                    request.headers.authorization,
                );
            } catch (e) {}
            return true;
        }

        return true;
    }
}
