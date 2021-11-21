import { User } from 'src/domain/user/domain/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from '../club.entity';

@Entity('club_follow')
export class ClubFollow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.followings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Club, (club) => club.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'club_id' })
    club: Club;
}
