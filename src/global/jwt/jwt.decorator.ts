import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from './types/jwt';

export const UserName = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req: Request = context.switchToHttp().getRequest();
        return req.user ? (req.user as JwtPayload).sub : null;
    },
);
