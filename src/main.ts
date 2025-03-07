import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.enableCors({ origin: "*", credentials: true });
    await app.listen(3000);
}
bootstrap();
