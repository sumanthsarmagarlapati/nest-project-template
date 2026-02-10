import { Injectable, OnModuleInit,Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";
import { LogService } from "./logService";

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger();
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
      this.client = createClient(redisConfig);
      
      this.client.on("connect", async () => {
        await this.logService.infoLog("Redis Connection Successful", "Redis Service");
      });
      
      this.client.on("error", async error =>
        this.logService.errorLog(error, "Redis Connection Failed"),
      );
      
      await this.client.connect();
    } catch (error) {
      this.retryRedisConnection();
      await this.logService.errorLog(error, "Redis Connection Failed", false);
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
