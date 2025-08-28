import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";
import { LogService } from "./logService";

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  async onModuleInit() {
    await this.connectionInitilization();
  }

  async connectionInitilization(): Promise<void> {
    try {
      const redisConfig = this.configService.get("REDIS_CONFIG");
      console.log("Redis Config:", redisConfig);
      this.client = createClient(redisConfig);
      await this.client.connect();

      this.client.on("error", async error =>
        this.logService.errorLog(error, "Redis Connection Error"),
      );

      this.client.on("Redis Connection Successful", async () => {
        this.logService.infoLog("Redis Connection Successful", "Redis Service");
      });
    } catch (error) {
      this.retryRedisConnection();
      await this.logService.errorLog(error, "Redis Connection Initialization", false);
    }
  }

  async retryRedisConnection(): Promise<void> {
    try {
      setTimeout(async () => {
        await this.logService.infoLog("Retrying Redis Connection", "Redis Service");
        await this.connectionInitilization();
      }, 5000);
    } catch (error) {
      await this.logService.errorLog(error, "retryRedisConnection");
    }
  }
  async getKey(key: string): Promise<string | null> {
    try {
      if (this.client.isReady === false) {
        throw new Error("Redis client is not connected");
      }
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      await this.logService.errorLog(error, "getKey");
    }
  }

  async setKey(key: string, value: any) {
    if (this.client.isReady === false) {
      throw new Error("Redis client is not connected");
    }
    return await this.client.set(key, value);
  }
}
