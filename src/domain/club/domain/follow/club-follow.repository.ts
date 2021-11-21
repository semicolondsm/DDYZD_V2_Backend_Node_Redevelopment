import { User } from 'src/domain/user/domain/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Club } from '../club.entity';
import { ClubFollow } from './club-folow.entity';

@EntityRepository(ClubFollow)
export class ClubFollowRepository extends Repository<ClubFollow> {
    public createClubFollow(user: User, club: Club): Promise<ClubFollow> {
        const clubFollow = this.create({ user, club });
        return this.save(clubFollow);
    }

    public async deleteClubFollow(user: User, club: Club): Promise<void> {
        await this.delete({ user, club });
    }

    public async checkIsFollowed(
        user_id: number,
        club_id: number,
    ): Promise<boolean> {
        const follow: ClubFollow = await this.createQueryBuilder('follow')
            .where('follow.user_id = :user_id', { user_id })
            .andWhere('follow.club_id = :club_id', { club_id })
            .getOne();
        return !!follow;
    }
}
