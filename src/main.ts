import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { getConnectionToken } from "@nestjs/mongoose";
import { env } from "process";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const mongoConnection = app.get(getConnectionToken());
  Logger.log("MongoDB connected successfully", "Mongo Database");

  mongoConnection.on("error", error => {
    Logger.error(`MongoDB connection error: ${error}`, "Database");
  });

  const dataSOurce = app.get(DataSource);
  if (dataSOurce.isInitialized) {
    Logger.log(
      `${env.DB_TYPE?.toUpperCase()} Connected Successfully`,
      `${env.DB_TYPE?.toUpperCase()} Database`,
    );
  } else {
    Logger.log(
      `${env.DB_TYPE?.toUpperCase()} Not Connected`,
      `${env.DB_TYPE?.toUpperCase()} Database`,
    );
  }

  // Enable CORS with options from configuration
  app.enableCors(configService.getOrThrow<Record<string, any>>("CORS_OPTIONS"));
  const PORT = configService.getOrThrow<number>("PORT");
  await app.listen(PORT);
  Logger.log(`Server running on ${PORT}`, `Server Status`);
}

bootstrap();
