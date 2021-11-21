import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GithubModule } from 'src/infrastructure/github/github.module';
import { DsmAuthModule } from 'src/infrastructure/dsmauth/dsmauth.module';
import { EnvironmentConfigModule } from 'src/global/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/global/environment-config/environment-config.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "src/domain/user/domain/user.repository";
import { ClubUserViewRepository } from "src/domain/club/domain/user/club-user.view.repository";

@Module({
    imports: [
        GithubModule.register(),
        DsmAuthModule.register(),
        EnvironmentConfigModule,
        TypeOrmModule.forFeature([UserRepository, ClubUserViewRepository])
    ],
    controllers: [UserController],
    providers: [UserService, EnvironmentConfigService],
})
export class UserModule {}
