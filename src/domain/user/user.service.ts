import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/domain/user/domain/user.repository';
import { User } from 'src/domain/user/domain/user.entity';
import {
    ModifyUserBiodDto,
    ModifyUserGitHubIdDto,
    UserInfoResObj,
    UserTokenResOhj,
} from 'src/domain/user/dto/user.dto';
import { ClubUserView } from 'src/domain/club/domain/user/club-user.view.entity';
import { ClubUserViewRepository } from 'src/domain/club/domain/user/club-user.view.repository';
import { Octokit } from '@octokit/core';
import * as jwt from 'jsonwebtoken';
import { EnvironmentConfigService } from 'src/global/environment-config/environment-config.service';
import { DsmAuthClient } from 'src/infrastructure/dsmauth/dsmauth.client';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly clubUserViewRepository: ClubUserViewRepository,

        private readonly octokit: Octokit,
        private readonly dsmAuthClient: DsmAuthClient,

        private readonly environmentConfigService: EnvironmentConfigService,
    ) {}

    public async provideToken(token: string): Promise<UserTokenResOhj> {
        if (!token) {
            throw new NotFoundException('Invalid Parameter');
        }
        const userInfo = await this.dsmAuthClient.getDsmAuthUserInfomation(
            token,
        );
        const checkExistUser: User =
            await this.userRepository.findUserByUniqueEmail(userInfo.email);
        const authenticatedUser: User = checkExistUser
            ? checkExistUser
            : await this.userRepository.createDefaultUser(userInfo);
        return {
            access_token: await this.issuanceToken(
                authenticatedUser.id,
                'access',
            ),
            refresh_token: await this.issuanceToken(
                authenticatedUser.id,
                'refresh',
            ),
        };
    }

    public async refreshToken(
        user_id: number,
        refreshToken: string,
    ): Promise<UserTokenResOhj> {
        const accessToken: string = await this.issuanceToken(user_id, 'access');
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    public async proviceTokenWithCode(code: string) {
        const token: string = await this.dsmAuthClient.getDsmAuthUserToken(
            code,
        );
        const userInfo = await this.dsmAuthClient.getDsmAuthUserInfomation(
            `Bearer ${token}`,
        );
        const checkExistUser: User =
            await this.userRepository.findUserByUniqueEmail(userInfo.email);
        const authenticatedUser: User = checkExistUser
            ? checkExistUser
            : await this.userRepository.createDefaultUser(userInfo);
        return {
            access_token: await this.issuanceToken(
                authenticatedUser.id,
                'access',
            ),
            refresh_token: await this.issuanceToken(
                authenticatedUser.id,
                'refresh',
            ),
        };
    }

    public async showUserGcn(user_id: number): Promise<string> {
        const user: User = await this.userRepository.findOneOnlyGcn(user_id);
        if (!user) {
            throw new NotFoundException('Not Found User');
        }
        return user.gcn;
    }

    public async showUserInfo(gcn: string): Promise<UserInfoResObj> {
        const user: User = await this.userRepository.findUserByClassIdentity(
            gcn,
        );
        const clubs: ClubUserView[] =
            await this.clubUserViewRepository.findUsersClub(gcn);
        if (!user) {
            throw new NotFoundException('Not Found User');
        }
        delete user.device_token;
        return { ...user, clubs };
    }

    public async modifyUserGithubId(
        data: ModifyUserGitHubIdDto,
        user_id: number,
    ) {
        try {
            const profile: string = await this.getGitHubProfile(data.git);
            await this.userRepository.putUserGitHubId(data.git, user_id);
            await this.userRepository.putUserProfile(profile, user_id);
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    public async modifyUserBio(data: ModifyUserBiodDto, user_id: number) {
        try {
            await this.userRepository.putUserBio(data.bio, user_id);
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    public async deviceToken(token: string, user_id: number) {
        const splitToken = token.split(' ');
        if (splitToken[0] !== 'Bearer') {
            throw new UnauthorizedException('Unauthorized Device Token');
        }
        await this.userRepository.deviceToken(user_id, splitToken[1]);
    }

    private async issuanceToken(
        user_id: number,
        type: string,
    ): Promise<string> {
        return jwt.sign(
            {
                sub: `${user_id}`,
                type: type,
            },
            this.environmentConfigService.get('JWT_SECRET'),
            {
                algorithm: 'HS256',
                expiresIn: type === 'access' ? '2h' : '14d',
            },
        );
    }

    private async getGitHubProfile(github_id: string): Promise<string> {
        const response = await this.octokit.request(`GET /users/${github_id}`);
        return response.data.avatar_url;
    }
}
