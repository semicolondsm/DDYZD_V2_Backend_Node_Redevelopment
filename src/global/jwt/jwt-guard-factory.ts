import { BasicVerifyTokenGuard } from './basic-verify-token.guard';
import { OptionalVerifyTokenGuard } from './optional-verify-token.guard';
import { VerifyTokenGuard } from './verify-token.guard';
import { VerifyRefreshTokenGuard } from "./verify-refresh-token.guard";

export class JwtGuardFactory {
    private static basicVerifyTokenGuard: VerifyTokenGuard =
        new BasicVerifyTokenGuard();
    private static optionalVerifyTokenGuard: VerifyTokenGuard =
        new OptionalVerifyTokenGuard();
    private static  verifyRefreshTokenGuard: VerifyRefreshTokenGuard = new VerifyRefreshTokenGuard();

    public static createJwtGuard(
        type: 'REQUIRED' | 'OPTIONAL' | 'REFRESH',
    ): VerifyTokenGuard {
        switch (type) {
            case 'REQUIRED':
                return this.basicVerifyTokenGuard;
            case 'OPTIONAL':
                return this.optionalVerifyTokenGuard;
            case 'REFRESH':
                return this.verifyRefreshTokenGuard;
        }
    }
}
