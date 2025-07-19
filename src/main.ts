import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { env } from 'process';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable validation pipe globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  try {
    const mongoConnection = app.get(getConnectionToken());
    Logger.log('MongoDB connected successfully', 'Mongo Database');

    mongoConnection.on('disconnected', () => {
      Logger.warn('MongoDB disconnected', 'Database');
    });

    mongoConnection.on('error', (error) => {
      Logger.error(`MongoDB connection error: ${error}`, 'Database');
    });
  } catch (error) {
    Logger.error(`Failed to initialize MongoDB connection: ${error.message}`, 'Database');
  }

  app.enableCors(configService.getOrThrow<Record<string,any>>("CORS_OPTIONS"))
  const PORT = configService.getOrThrow<number>("PORT")
  await app.listen(PORT);
  Logger.log(`>>> On Port ~ ${PORT}`,`${env.DB_TYPE?.toUpperCase()} Server Running`)
}

bootstrap();
