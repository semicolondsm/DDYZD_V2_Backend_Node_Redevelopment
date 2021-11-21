import { Module } from '@nestjs/common';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { TypeormConfigModule } from 'src/global/typeorm-config/typeorm-config.module';
import { ClubModule } from 'src/domain/club/club.module';
import { UserModule } from "src/domain/user/user.module";

@Module({
    imports: [TypeormConfigModule, ClubModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
