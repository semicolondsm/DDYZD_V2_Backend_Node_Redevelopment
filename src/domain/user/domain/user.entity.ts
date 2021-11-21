import { ClubHead } from 'src/domain/club/domain/head/club-head.entity';
import { ClubMember } from 'src/domain/club/domain/member/club-member.entity';
import { ClubFollow } from 'src/domain/club/domain/follow/club-folow.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 45 })
    name: string;

    @Column({ type: 'varchar', length: 5 })
    gcn: string;

    @Column({ type: 'varchar', nullable: true })
    image_path?: string;

    @Column({ type: 'varchar', nullable: true })
    github_url?: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 4096, nullable: true })
    device_token: string;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => ClubFollow, (clubFollow) => clubFollow.user)
    followings: ClubFollow[];

    @OneToMany(() => ClubMember, (application) => application.user)
    members: ClubMember[];

    @OneToMany(() => ClubHead, (clubHead) => clubHead.user)
    heads: ClubHead[];
}
