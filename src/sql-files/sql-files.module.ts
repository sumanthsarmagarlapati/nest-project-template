import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [AdminModule, TypeOrmModule.forFeature([])],
  exports: [AdminModule],
})
export class SqlModule {}
