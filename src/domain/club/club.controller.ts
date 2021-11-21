import {
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtGuardFactory } from 'src/global/jwt/jwt-guard-factory';
import { UserName } from 'src/global/jwt/jwt.decorator';
import { ClubService } from './club.service';

@Controller('club')
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    @Get('/list')
    public list() {
        return this.clubService.showClubList();
    }

    @Get('/:club_id/info')
    @UseGuards(JwtGuardFactory.createJwtGuard('OPTIONAL'))
    public clubInfo(
        @Param('club_id', new ParseIntPipe()) club_id: number,
        @UserName() user_id: number,
    ) {
        return this.clubService.showClubInfo(club_id, user_id);
    }

    @Post('/:club_id/follow')
    @UseGuards(JwtGuardFactory.createJwtGuard('REQUIRED'))
    public follow(
        @Param('club_id', new ParseIntPipe()) club_id: number,
        @UserName() user_id: number,
    ) {
        return this.clubService.followClubHandler(user_id, club_id);
    }

    @Delete('/:club_id/follow')
    @UseGuards(JwtGuardFactory.createJwtGuard('REQUIRED'))
    public unFollow(
        @Param('club_id', new ParseIntPipe()) club_id: number,
        @UserName() user_id: number,
    ) {
        return this.clubService.unfollowClub(user_id, club_id);
    }

    @Get('/:club_id/member')
    public clubMember(@Param('club_id', new ParseIntPipe()) club_id: number) {
        return this.clubService.showClubsMember(club_id);
    }

    @Get('/:club_id/recruitment')
    public recruitment(@Param('club_id', new ParseIntPipe()) club_id: number) {
        return this.clubService.showClubRecruitments(club_id);
    }

    @Get('/:club_id/status')
    public status(@Param('club_id', new ParseIntPipe()) club_id: number) {
        return this.clubService.showClubStatus(club_id);
    }

    @Get('/promotional')
    public banner() {
        return this.clubService.showPromotionalMaterial();
    }
}
