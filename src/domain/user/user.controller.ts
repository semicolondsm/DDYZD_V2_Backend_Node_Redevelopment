import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/domain/user/user.service';
import { ModifyUserBiodDto, ModifyUserGitHubIdDto, ProvideUserTokenDto } from "src/domain/user/dto/user.dto";
import { JwtGuardFactory } from 'src/global/jwt/jwt-guard-factory';
import { UserName } from 'src/global/jwt/jwt.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/token')
    public token(@Headers('access-token') token: string) {
        return this.userService.provideToken(token);
    }

    @Post('/token/code')
    public tokenAndCode(@Body() body: ProvideUserTokenDto) {
        return this.userService.proviceTokenWithCode(body.code);
    }

    @Get('/refresh')
    @UseGuards(JwtGuardFactory.createJwtGuard('REFRESH'))
    public refresh(@UserName() user_id: number, @Headers("refresh-token") refresh_token: string) {
        return this.userService.refreshToken(user_id, refresh_token.substring(7));
    }

    @Get('/profile')
    @UseGuards(JwtGuardFactory.createJwtGuard('REQUIRED'))
    public async profile(@UserName() user_id: number) {
        return {
            gcn: await this.userService.showUserGcn(user_id),
        }
    }

    @Get('/:user_gcn')
    public async userInfo(@Param('user_gcn') gcn: string) {
        return this.userService.showUserInfo(gcn);
    }

    @Put('/profile/git')
    @UseGuards(JwtGuardFactory.createJwtGuard('REQUIRED'))
    public gitProfile(@Body() body: ModifyUserGitHubIdDto, @UserName() user_id: number) {
        return this.userService.modifyUserGithubId(body, user_id);
    }

    @Put("/profile/bio")
    @UseGuards(JwtGuardFactory.createJwtGuard('REQUIRED'))
    public bioProfile(@Body() body: ModifyUserBiodDto, @UserName() user_id: number) {
        return this.userService.modifyUserBio(body, user_id);
    }

    @Post("/device_token")
    public deviceToken(@Headers("device-token") token: string, @UserName() user_id: number) {
        return this.userService.deviceToken(token, user_id);
    }
}
