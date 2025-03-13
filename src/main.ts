import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.enableCors(configService.getOrThrow<Record<string,any>>("CORS_OPTIONS"))
  const PORT = configService.getOrThrow<number>("PORT")
  await app.listen(PORT);
  Logger.log(`>>> On Port ~ ${PORT}`,`${env.DB_TYPE.toUpperCase()} Server Running`)
}
bootstrap();
