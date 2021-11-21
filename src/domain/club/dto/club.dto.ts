export class ClubListResObj {
    clubid: number;
    clubname: string;
    clubdescription: string;
    clubimage: string;
    clubbanner: string;
    clubtag: string | string[];
    clubrecruitment: boolean;
}

export class ClubDefaultInfoObj {
    clubid: number;
    clubname: string;
    clubtag?: string[];
    clubimage: string;
    backimage: string;
    description: string;
    recruitment: boolean;
    recruitment_close?: Date;
}

export class ClubInfoResObj extends ClubDefaultInfoObj {
    owner: boolean;
    follow: boolean;
}

export class ClubRecruitmentInfoResObj {
    major: string[];
    closeat: Date;
    startat: Date;
}

export class ClubMemberResObj {
    user_id?: number;
    user_name: string;
    profile_image: string;
    gcn: string;
    git: string;
}

export class UserTokenResOhj {
    access_token: string;
    refresh_token: string;
}

export class ClubImagesResObj {
    name: string;
    image: string;
    profile: string;
}
