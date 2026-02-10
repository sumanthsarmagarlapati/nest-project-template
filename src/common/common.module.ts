import { Global, Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { EventStoreService } from "./services/eventstore.service";
import { LogService } from "./services/logService";
import { RedisService } from "./services/redis.service";

@Global()
@Module({
  providers: [CommonService, LogService, EventStoreService, RedisService],
  exports: [CommonService, LogService, EventStoreService, RedisService],
})
export class CommonModule {}
