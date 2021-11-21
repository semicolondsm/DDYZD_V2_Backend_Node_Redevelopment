import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from '../user/domain/user.entity';
import { UserRepository } from '../user/domain/user.repository';
import { Club } from './domain/club.entity';
import { ClubRepository } from './domain/club.repository';
import { ClubFollowRepository } from './domain/follow/club-follow.repository';
import { ClubFollow } from './domain/follow/club-folow.entity';
import { ClubTagViewRepository } from './domain/hastag/club-tag.view.repository';
import { ClubHead } from './domain/head/club-head.entity';
import { ClubHeadRepository } from './domain/head/club-head.repository';
import { ClubUserView } from './domain/user/club-user.view.entity';
import { ClubUserViewRepository } from './domain/user/club-user.view.repository';
import {
    ClubDefaultInfoObj,
    ClubImagesResObj,
    ClubInfoResObj,
    ClubListResObj,
    ClubMemberResObj,
    ClubRecruitmentInfoResObj,
} from './dto/club.dto';

@Injectable()
export class ClubService {
    constructor(
        private readonly clubRepository: ClubRepository,
        private readonly clubTagViewRepository: ClubTagViewRepository,
        private readonly userRepository: UserRepository,
        private readonly clubUserViewRepository: ClubUserViewRepository,
        private readonly clubHeadRepository: ClubHeadRepository,
        private readonly clubFollowRepository: ClubFollowRepository,
    ) {}

    public async showClubList(): Promise<ClubListResObj[]> {
        const clubs: ClubListResObj[] =
            await this.clubTagViewRepository.findAllClub();
        return await Promise.all(
            clubs.map(async (club) => {
                const serializedClubtags: string = club.clubtag as string;
                club.clubtag = serializedClubtags.split(',');
                club.clubrecruitment =
                    await this.clubRepository.getClubRecruitmentInfo(
                        club.clubid,
                    );
                return club;
            }),
        );
    }

    public async showClubInfo(
        club_id: number,
        user_id: number,
    ): Promise<ClubInfoResObj> {
        const club: Club = await this.clubRepository.findOne({
            where: { id: club_id },
        });
        if (!club) {
            throw new NotFoundException('Not Found Club');
        }
        const resObj: ClubDefaultInfoObj = await this.getClubDefaultInfo(club);
        if (user_id) {
            const user: User = await this.userRepository.findOne({
                where: { id: user_id },
            });
            const clubHead: ClubHead = await this.clubHeadRepository.findOne({
                where: { club, user },
            });
            const clubFollow: ClubFollow =
                await this.clubFollowRepository.findOne({
                    where: { club, user },
                });
            return { ...resObj, owner: !!clubHead, follow: !!clubFollow };
        } else {
            return { ...resObj, owner: false, follow: false };
        }
    }

    public async followClubHandler(user_id: number, club_id: number) {
        const userRecord: User = await this.userRepository.findOne(user_id);
        const clubRecord: Club = await this.clubRepository.findOne(club_id);
        if (!userRecord || !clubRecord) {
            throw new NotFoundException('Not Found Club or User');
        }
        const followRecord: ClubFollow =
            await this.clubFollowRepository.findOne({
                user: userRecord,
                club: clubRecord,
            });
        if (followRecord) {
            throw new BadRequestException('이미 팔로우 했습니다');
        }
        await this.clubFollowRepository.createClubFollow(
            userRecord,
            clubRecord,
        );
    }

    public async unfollowClub(user_id: number, club_id: number) {
        const userRecord: User = await this.userRepository.findOne(user_id);
        const clubRecord: Club = await this.clubRepository.findOne(club_id);
        const existRecord: ClubFollow = await this.clubFollowRepository.findOne(
            {
                user: userRecord,
                club: clubRecord,
            },
        );
        if (!userRecord || !clubRecord || !existRecord) {
            throw new NotFoundException('Not Found User');
        }
        await this.clubFollowRepository.deleteClubFollow(
            userRecord,
            clubRecord,
        );
    }

    public async showClubsMember(club_id: number): Promise<ClubMemberResObj[]> {
        const head: ClubMemberResObj =
            await this.clubHeadRepository.findClubHead(club_id);
        if (!head) {
            throw new NotFoundException('Not Found Club Head');
        }
        const members: ClubMemberResObj[] =
            await this.clubUserViewRepository.findClubsMember(
                club_id,
                head.user_id,
            );
        if (!members) {
            throw new NotFoundException('Not Found Club Member');
        }
        members.unshift(head);
        return members;
    }

    public async showClubRecruitments(
        club_id: number,
    ): Promise<ClubRecruitmentInfoResObj> {
        const recruitment: Club =
            await this.clubRepository.findClubRecruitments(club_id);
        if (!recruitment) {
            throw new NotFoundException('Not Found Club');
        }
        return {
            major: recruitment.majors.map((major) => major.major_name),
            startat: recruitment.start_at,
            closeat: recruitment.close_at,
        };
    }

    public async showClubStatus(club_id: number): Promise<Club> {
        const status: Club = await this.clubRepository.findClubStatus(club_id);
        if (!status) {
            throw new NotFoundException('Not Found Cub');
        }
        return status;
    }

    public async showBannerImage(): Promise<ClubImagesResObj[]> {
        const banners: ClubImagesResObj[] =
            await this.clubRepository.findClubBanners();
        return banners;
    }

    public async showPromotionalMaterial(): Promise<ClubImagesResObj[]> {
        const materials: ClubImagesResObj[] =
            await this.clubRepository.findClubPromotionalMaterial();
        return materials;
    }

    private async checkIsNotClubMember(
        club_id: number,
        user_id: number,
    ): Promise<boolean> {
        const clubAndUser: ClubUserView =
            await this.clubUserViewRepository.findOne({
                where: { club_id, user_id },
            });
        return !clubAndUser;
    }

    private async getClubDefaultInfo(club: Club): Promise<ClubDefaultInfoObj> {
        return {
            clubid: club.id,
            clubname: club.name,
            clubtag: await this.clubTagViewRepository.findClubTagsById(club.id),
            clubimage: club.profile_image,
            backimage: club.banner_image,
            description: club.description,
            recruitment: !!club.close_at,
            recruitment_close: club.close_at,
        };
    }
}
