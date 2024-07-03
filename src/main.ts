import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  Logger.log(`DB_HOST: ${configService.get<string>('DB_HOST')}`);
  await app.listen(3000);
}
bootstrap();
