import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Club } from '../club.entity';

@Entity('major')
export class Major {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 45 })
    major_name: string;

    @ManyToOne(() => Club, (club) => club.majors)
    @JoinColumn({ name: 'club_id' })
    club: Club;
}
