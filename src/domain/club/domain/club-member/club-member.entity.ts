import { User } from 'src/domain/user/domain/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from '../club.entity';

@Entity('club_member')
export class ClubMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.members)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Club, (club) => club.members)
    @JoinColumn({ name: 'club_id' })
    club: Club;
}
