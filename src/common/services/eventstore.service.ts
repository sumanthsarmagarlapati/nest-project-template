import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
@Injectable()
export class EventStoreService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initService();
  }

  async initService() {
    const rabbitmqConfig = this.configService.getOrThrow('RABBIT_MQ');

    this.connection = await amqp.connect(rabbitmqConfig);

    this.connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
    });

    this.channel = await this.connection.createChannel();

    this.channel.on('error', (err) => {
      console.error('RabbitMQ channel error:', err);
    });

    this.connection.on('connect', () => {
      console.log('RabbitMQ connection established Successful');
    });
  }

  async publishMessage(
    config: {
      type: 'direct' | 'topic' | 'fanout' | 'headers';
      key: string;
      queue?: string;
      exchange?: string;
    },
    message: any,
  ) {
    if (config.type === 'direct' && config?.queue) {
    } else if (config.type == 'fanout' && config?.exchange) {
    } else if (config.type == 'topic' && config?.exchange) {
    } else if (config.type == 'headers' && config?.exchange) {
    } else {
      throw new Error('Invalid configuration');
    }

    try {
    } catch (error) {}
  }
}
