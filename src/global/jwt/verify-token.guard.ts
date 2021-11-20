import 'dotenv/config';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt';

@Injectable()
export abstract class VerifyTokenGuard implements CanActivate {
    abstract canActivate(context: ExecutionContext): Promise<boolean>;

    async validateToken(auth: string): Promise<JwtPayload> {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new ForbiddenException('Invalid token');
        }
        const token: string = auth.split(' ')[1];
        try {
            const decoded: JwtPayload = jwt.verify(
                token,
                process.env.JWT_SECRET,
            ) as JwtPayload;
            return decoded;
        } catch (err) {
            const message: string = `Token error ${
                err.message || 'Unauthorized token'
            }`;
            throw new UnauthorizedException(message);
        }
    }
}
