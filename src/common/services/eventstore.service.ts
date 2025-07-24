import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { env } from 'process';

@Injectable()
export class EventStoreService implements OnModuleInit {
  private publisherChannel: amqp.Channel;
  private consumerChannel: amqp.Channel;
  private isConnected = false;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initService();
  }

  async initService() {
    try {
      this.isConnected = true;
      const rabbitmqConfig = this.configService.getOrThrow('RABBIT_MQ');

      const connection: amqp.Connection = await amqp.connect(rabbitmqConfig);

      connection.on('error', (err) => {
        this.isConnected = false;
        console.error('RabbitMQ connection error:', err);
      });

      this.publisherChannel = await connection.createChannel();
      connection.on('connect', () => {
        console.log('RabbitMQ connection established Successful');
      });

      this.activateConsumer(env.RABBIT_MQ_CONSUMER);
    } catch (error) {
      await this.retryConnection();
    }
  }

  async retryConnection() {
    if (!this.isConnected) {
      setTimeout(async () => {
        await this.initService();
        console.log('Retrying RabbitMQ connection...');
      }, 5000);
    }
  }

  async activateConsumer(queue: string) {
    try {
      await this.consumerChannel.preFetch(5);
      await this.consumerChannel.assertQueue(queue, { durable: true });
      await this.consumerChannel.assertExchange(
        env.EVENT_STAORE_EXCHANGE,
        'fanout',
        { durable: true },
      );
      await this.consumerChannel.bindQueue(
        queue,
        env.EVENT_STAORE_EXCHANGE,
        '',
      );
      this.consumerChannel.consume(queue, (msg) => {
        const mesage = JSON.parse(msg.content.toString());
        console.log('Received message:', mesage);
      });
    } catch (error) {}
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
    const messageBuffer = Buffer.from(JSON.stringify(message));
    if (config.type === 'direct' && config?.queue) {
      await this.publisherChannel.assertQueue(config.queue, { durable: true });
      await this.publisherChannel.sendToQueue(config.queue, messageBuffer);
    } else if (
      (config.type == 'fanout' || config.type == 'topic') &&
      config?.exchange
    ) {
      await this.publisherChannel.assertExchange(config.exchange, config.type);
      await this.publisherChannel.publish(
        config.exchange,
        config.key,
        messageBuffer,
      );
    } else if (config.type == 'topic' && config?.exchange) {
    }
    console.log('Published message:', message);
    try {
    } catch (error) {}
  }
}
