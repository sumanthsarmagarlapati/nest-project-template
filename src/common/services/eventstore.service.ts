import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { env } from 'process';
import configuration from '../../config/configuration';

@Injectable()
export class EventStoreService implements OnModuleInit, OnModuleDestroy {
  private consumerChannel: amqp.Channel;
  private producerChannel: amqp.Channel;
  private connection: amqp.Connection;
  private isConnected = false;

  constructor() {}

  async onModuleInit() {
    if (process.env.EVENT_STORE_SERVICE === 'true') {
      await this.initConnection();
    }
  }

  private async initConnection() {
    if (this.isConnected) return;
    const config = configuration();
    this.connection = await amqp.connect(config.RABBIT_MQ);

    this.connection.on('close', (err) => {
      console.error('RabbitMQ connection closed', err); // Log the error4
      this.retryConnection(); // Attempt to reconnect
      this.isConnected = false; // Update connection status
    });
    this.connection.on('error', (err) => {
      console.error('RabbitMQ connection closed', err); // Log the error
      this.retryConnection(); // Attempt to reconnect

      this.isConnected = false; // Update connection status
    });

    // Producer channel
    this.producerChannel = await this.connection.createChannel();

    // Consumer channel
    this.consumerChannel = await this.connection.createChannel();

    if (env.EVENT_STORE_CONSUMER_QUEUE) {
    }
    this.isConnected = true;
  }
  
  async eventConsumerQueue(queue: string) {}

  retryConnection() {
    if (this.isConnected) {
      setTimeout(() => {
        this.initConnection().catch((err) =>
          console.error('Failed to reconnect to RabbitMQ', err),
        );
      }, 5000); // Retry after 5 seconds
    }
  }
  async publish(queue: string, message: any) {
    if (!this.producerChannel)
      throw new Error('Producer channel not initialized');
    await this.producerChannel.assertQueue(queue, { durable: true });
    this.producerChannel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async consume(queue: string, onMessage: (msg: amqp.ConsumeMessage) => void) {
    if (!this.consumerChannel)
      throw new Error('Consumer channel not initialized');
    await this.consumerChannel.assertQueue(queue, { durable: true });
    this.consumerChannel.consume(queue, (msg) => {
      if (msg) {
        onMessage(msg);
        this.consumerChannel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.producerChannel?.close();
    await this.consumerChannel?.close();
    await this.connection?.close();
  }
}
