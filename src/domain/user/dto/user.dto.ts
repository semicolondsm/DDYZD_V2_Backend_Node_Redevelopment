import { User } from 'src/domain/user/domain/user.entity';
import { ClubUserView } from 'src/domain/club/domain/user/club-user.view.entity';

export class UserTokenResOhj {
    access_token: string;
    refresh_token: string;
}

export class UserInfoResObj extends User {
    clubs: ClubUserView[];
}

export class UserActivitiesResObj {
    activity: string;
    date: Date;
    club_name: string;
    club_image: string;
    club_id: number;
}

export class ProvideUserTokenDto {
    code: string;
}

export class ModifyUserGitHubIdDto {
    git: string;
}

export class ModifyUserBiodDto {
    bio: string;
}
