import { BasicVerifyTokenGuard } from './basic-verify-token.guard';
import { OptionalVerifyTokenGuard } from './optional-verify-token.guard';
import { VerifyTokenGuard } from './verify-token.guard';

export class JwtGuardFactory {
    private static basicVerifyTokenGuard: VerifyTokenGuard =
        new BasicVerifyTokenGuard();
    private static optionalVerifyTokenGuard: VerifyTokenGuard =
        new OptionalVerifyTokenGuard();

    public static createJwtGuard(
        type: 'REQUIRED' | 'OPTIONAL',
    ): VerifyTokenGuard {
        switch (type) {
            case 'REQUIRED':
                return this.basicVerifyTokenGuard;
            case 'OPTIONAL':
                return this.optionalVerifyTokenGuard;
        }
    }
}
