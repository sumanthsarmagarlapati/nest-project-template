import { Injectable, Logger, OnModuleDestroy, OnModuleInit, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";
import { publishConfigInterface } from "../common.interface";
import { LogService } from "./logService";

@Injectable({ scope: Scope.DEFAULT })
export class EventStoreService implements OnModuleInit, OnModuleDestroy {
  private publisherChannel: amqp.Channel;
  private consumerChannel: amqp.Channel;
  private isConnected = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {}

  async onModuleInit() {
    await this.initEventStoreService();
  }

  async onModuleDestroy() {
    if (this.publisherChannel) this.publisherChannel.close();
    if (this.consumerChannel) this.consumerChannel.close();
  }

  async initEventStoreService() {
    try {
      this.isConnected = true;
      const rabbitmqUrl = this.configService.getOrThrow("RABBIT_MQ");
      const connection = await amqp.connect(rabbitmqUrl);

      connection.on("error", async err => {
        this.isConnected = false;
        await this.logService.errorLog(err, "RabbitMQ Connection");
      });

      this.publisherChannel = await connection.createChannel();
      this.consumerChannel = await connection.createChannel();

      this.publisherChannel.on("error", async err => {
        await this.logService.errorLog(err, "Publisher Channel");
      });
      this.consumerChannel.on("error", async err => {
        await this.logService.errorLog(err, "Consumer Channel");
      });

      await this.logService.infoLog(
        "RabbitMQ connection established successfully",
        "RabbitMQ Service",
      );

      const consumerQueue = this.configService.getOrThrow("RABBIT_MQ_QUEUE");
      await this.activateConsumer(consumerQueue);
    } catch (error) {
      await this.retryConnection();
      await this.logService.errorLog(error, "initEventStoreService");
    }
  }

  async retryConnection() {
    if (!this.isConnected) {
      setTimeout(async () => {
        await this.initEventStoreService();
        await this.logService.infoLog("Retrying RabbitMQ connection...", "RabbitMQ Reconnect");
      }, 5000);
    }
  }

  async activateConsumer(queue: string): Promise<void> {
    try {
      const exchange = this.configService.getOrThrow("RABBIT_MQ_EXCHANGE");
      await this.consumerChannel.prefetch(5);
      await this.consumerChannel.assertQueue(queue, {
        durable: true,
      });

      await this.consumerChannel.assertExchange(exchange, "fanout", {
        durable: true,
      });

      await this.consumerChannel.bindQueue(queue, exchange, "");

      await this.consumerChannel.consume(queue, async msg => {
        if (msg) {
          try {
            const contentStr = msg.content.toString();
            const message = JSON.parse(contentStr);

            await this.logService.infoLog(
              `Consumer received message from queue ${queue}:\n${JSON.stringify(message, null, 2)}`,
              "RabbitMQ Consumer",
            );

            await this.consumerChannel.ack(msg);
          } catch {
            Logger.error(
              new Error(`Invalid Cosumer Message Foramt as: ${msg.content.toString()}`),
              "Consumer Message",
            );
            this.consumerChannel.nack(msg, false, false);
          }
        }
      });

      await this.logService.infoLog(`Consumer activated for queue: ${queue}`, "RabbitMQ Consumer");
    } catch (error) {
      await this.logService.errorLog(error, "activateConsumer");
      await this.retryConnection();
    }
  }

  async publishMessage(config: publishConfigInterface, message: any) {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      if (config.type === "direct" && config?.queue) {
        await this.publisherChannel.assertQueue(config.queue, { durable: true });
        await this.publisherChannel.sendToQueue(config.queue, messageBuffer);
      } else if ((config.type === "fanout" || config.type === "topic") && config?.exchange) {
        await this.publisherChannel.assertExchange(config.exchange, config.type);
        await this.publisherChannel.publish(config.exchange, config.key || "", messageBuffer);
      }

      await this.logService.infoLog(
        `Message published to ${config.type === "direct" ? `queue: ${config.queue}` : `exchange: ${config.exchange}`} with payload:\n${JSON.stringify(message, null, 2)}`,
        "RabbitMQ Publisher",
      );
    } catch (error) {
      await this.logService.errorLog(error, "publishMessage");
    }
  }
}
