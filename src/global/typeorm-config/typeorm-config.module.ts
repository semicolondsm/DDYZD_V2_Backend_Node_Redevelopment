import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigService } from 'src/global/environment-config/environment-config.service';
import { EnvironmentConfigModule } from 'src/global/environment-config/environment-config.module';

export const getTypeOrmModuleOptions = (
    environmentConfigService: EnvironmentConfigService,
): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: environmentConfigService.get('PRODUCTION_HOST'),
    port: +environmentConfigService.get('PRODUCTION_PORT'),
    username: environmentConfigService.get('PRODUCTION_USERNAME'),
    password: environmentConfigService.get('PRODUCTION_PASSWORD'),
    database: environmentConfigService.get('PRODUCTION_DATABASE'),
    synchronize: false,
    entities: ['./dist/**/*.entity.js'],
});

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [EnvironmentConfigModule],
            inject: [EnvironmentConfigService],
            useFactory: getTypeOrmModuleOptions,
        }),
    ],
})
export class TypeormConfigModule {}
