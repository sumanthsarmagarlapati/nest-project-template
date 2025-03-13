import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataBaseConfig } from './config/databas.config';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[configuration],
      isGlobal:true
    }),
    TypeOrmModule.forRoot({ ...dataBaseConfig, autoLoadEntities: true }),
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
