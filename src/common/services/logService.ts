import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class LogService {
  private readonly logger = new Logger("AppLogger");

  // General logs
  async infoLog(message: string, context: string, meta?: any) {
    this.logger.log(await this.formatMessage(message, meta), context);
  }

  async warnLog(message: string, context: string, meta?: any) {
    this.logger.warn(await this.formatMessage(message, meta), context);
  }

  async debugLog(message: string, context: string, meta?: any) {
    this.logger.debug(await this.formatMessage(message, meta), context);
  }

  // Error logs with error handling
  async errorLog(error: any, context: string, throwError?:boolean): Promise<void> {
    const message = error.message || "Unknown error";
    this.logger.error(`❌ Error in [${context}]: ${message}`, error.stack);

    // Handle Mongoose Validation Error
    if (error.name === "ValidationError") {
      throw new BadRequestException({
        status: 400,
        message: Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", "),
      });
    }

    // Handle Duplicate Key (Mongo: 11000, PG: 23505)
    if (error.code === 11000 || error.code === "23505") {
      const fields = error.keyPattern
        ? Object.keys(error.keyPattern) // Mongoose
        : error.constraint?.split("_")[1]?.split("_")?.filter(Boolean) || []; // TypeORM
      const fieldNames = fields.join(" and ");
      throw new BadRequestException({
        status: 400,
        message: `Record with this ${fieldNames} already exists`,
      });
    }

    // Forward known NestJS errors
    if (error instanceof NotFoundException) {
      throw new NotFoundException({
        status: 404,
        message: error.message,
      });
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException({
        status: 400,
        message: error.message,
      });
    }

    if (throwError) {
      throw new InternalServerErrorException({
        status: 500,
        message,
      });
    }
  }

  // Util to add context + metadata
  private async formatMessage(message: string, meta?: any): Promise<string> {
    const base = ` ${message}`;
    if (meta) {
      return `${base} | Meta: ${JSON.stringify(meta)}`;
    }
    return base;
  }
}
