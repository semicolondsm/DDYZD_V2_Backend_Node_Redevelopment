import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubRepository } from 'src/domain/club/domain/club.repository';
import { ClubTagViewRepository } from 'src/domain/club/domain/hastag/club-tag.view.repository';
import { UserRepository } from 'src/domain/user/domain/user.repository';
import { ClubUserViewRepository } from 'src/domain/club/domain/user/club-user.view.repository';
import { ClubHeadRepository } from 'src/domain/club/domain/head/club-head.repository';
import { ClubFollowRepository } from 'src/domain/club/domain/follow/club-follow.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClubRepository,
            ClubTagViewRepository,
            UserRepository,
            ClubUserViewRepository,
            ClubHeadRepository,
            ClubFollowRepository,
        ]),
    ],
    providers: [ClubService],
    controllers: [ClubController],
})
export class ClubModule {}
