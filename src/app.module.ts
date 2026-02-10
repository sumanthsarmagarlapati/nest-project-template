import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { dataBaseConfig } from "./config/databas.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { SqlModule } from "./sql-files/sql-files.module";
import { CommonModule } from "./common/common.module";
import { NosqlFilesModule } from "./nosql-files/nosql-files.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow("MONGO_CONNECTION"),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({ ...dataBaseConfig, autoLoadEntities: true }),
    CommonModule,
    SqlModule,
    NosqlFilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
