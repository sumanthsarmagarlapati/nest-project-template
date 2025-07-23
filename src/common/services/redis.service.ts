import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connectionInitilization();
  }

  async connectionInitilization(): Promise<void> {
    const redisConfig = this.configService.get('REDIS_CONFIG');
    this.client = createClient(redisConfig);
    await this.client.connect();

    this.client.on('error', (error) => {
      console.error('Redis Connection Error:', error);
    });

    this.client.on('Redis Connection Successful', () => {
      console.log('Redis Connection');
    });
  }

  async getKey(key: string): Promise<string | null> {
    try {
      if (this.client.isReady === false) {
        throw new Error('Redis client is not connected');
      }
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error('Error getting key from Redis:', error);
      return null;
    }
  }

  async setKey(key: string, value: any) {
    if (this.client.isReady === false) {
      throw new Error('Redis client is not connected');
    }
    return await this.client.set(key, value);
  }
}
