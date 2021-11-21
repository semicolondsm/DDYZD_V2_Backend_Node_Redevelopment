import { User } from 'src/domain/user/domain/user.entity';
import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from '../club.entity';

@Entity('club_head')
export class ClubHead {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => Club, (club) => club.head)
    @JoinColumn({ name: 'club_id' })
    club: Club;

    @ManyToOne(() => User, (user) => user.heads)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
