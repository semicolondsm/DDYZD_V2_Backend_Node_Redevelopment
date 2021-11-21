import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from '../club.entity';
import { Tag } from '../tag/tag.entity';

@Entity('club_has_tag')
export class ClubHasTag {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Club, (club) => club.clubHasTags)
    @JoinColumn({ name: 'club_id' })
    club: Club;

    @ManyToOne(() => Tag, (tag) => tag.clubHasTags)
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}
