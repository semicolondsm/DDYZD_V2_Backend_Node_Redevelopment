import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubHead } from './head/club-head.entity';
import { ClubMember } from './member/club-member.entity';
import { ClubHasTag } from './hastag/club-tag.entity';
import { ClubFollow } from './follow/club-folow.entity';
import { Major } from './major/major.entity';

@Entity('club')
export class Club {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 45 })
    name: string;

    @Column({ default: 0 })
    total_budget: number;

    @Column({ default: 0 })
    current_budget: number;

    @Column({ type: 'datetime', nullable: true })
    start_at?: Date;

    @Column({ type: 'datetime', nullable: true })
    close_at?: Date;

    @Column({ nullable: true })
    description: string;

    @Column()
    banner_image: string;

    @Column()
    profile_image: string;

    @Column({ nullable: true })
    hongbo_image: string;

    @OneToMany(() => Major, (major) => major.club)
    majors: Major[];

    @OneToMany(() => ClubHasTag, (clubHasTag) => clubHasTag.club)
    clubHasTags: ClubHasTag[];

    @OneToMany(() => ClubFollow, (clubFollow) => clubFollow.club)
    followers: ClubFollow[];

    @OneToMany(() => ClubMember, (application) => application.club)
    members: ClubMember[];

    @OneToOne(() => ClubHead, (clubHead) => clubHead.club)
    head: ClubHead;
}
