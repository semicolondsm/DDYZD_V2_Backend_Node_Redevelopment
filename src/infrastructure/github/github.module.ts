import { DynamicModule, Module } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { EnvironmentConfigModule } from 'src/global/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/global/environment-config/environment-config.service';

@Module({
    imports: [EnvironmentConfigModule],
})
export class GithubModule {
    public static register(): DynamicModule {
        return {
            module: GithubModule,
            providers: [
                {
                    inject: [EnvironmentConfigService],
                    provide: Octokit,
                    useFactory: (
                        environmentConfigService: EnvironmentConfigService,
                    ) =>
                        new Octokit({
                            auth: environmentConfigService.get(
                                'GITHUB_ACCESS_TOKEN',
                            ),
                        }),
                },
            ],
            exports: [Octokit],
        };
    }
}
