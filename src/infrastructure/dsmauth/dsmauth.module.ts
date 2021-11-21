import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from 'src/global/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/global/environment-config/environment-config.service';
import { DsmAuthClient } from './dsmauth.client';

@Module({
    imports: [EnvironmentConfigModule],
})
export class DsmAuthModule {
    public static register(): DynamicModule {
        return {
            module: DsmAuthModule,
            providers: [
                {
                    inject: [EnvironmentConfigService],
                    provide: DsmAuthClient,
                    useFactory: (
                        environmentConfigService: EnvironmentConfigService,
                    ) =>
                        new DsmAuthClient(
                            environmentConfigService.get('DSM_AUTH_CLIENT_ID'),
                            environmentConfigService.get(
                                'DSM_AUTH_CLIENT_SECRET',
                            ),
                        ),
                },
            ],
            exports: [DsmAuthClient],
        };
    }
}
