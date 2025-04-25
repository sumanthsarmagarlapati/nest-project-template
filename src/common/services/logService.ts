import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class LogService {
  private readonly logger = new Logger('ErrorHandler');

  errorLog(error: any, context: string): never {
    this.logger.error(`Error in ${context}: ${error.message}`, error.stack);

    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
      throw new BadRequestException({
        status: 400,
        message: Object.values(error.errors).map((err: any) => err.message).join(', ')
      });
    }

    // Mongoose/TypeORM Duplicate Key Error
    if (error.code === 11000 || error.code === '23505') {
      // Get the duplicate field names
      const fields = error.keyPattern 
        ? Object.keys(error.keyPattern)  // For Mongoose
        : error.constraint?.split('_')[1]?.split('_')?.filter(Boolean) || []; // For TypeORM

      const fieldNames = fields.join(' and ');
      throw new BadRequestException({
        status: 400,
        message: `Record with this ${fieldNames} already exists`
      });
    }

    // Not Found Error
    if (error instanceof NotFoundException) {
      throw new NotFoundException({
        status: 404,
        message: error.message
      });
    }

    // Bad Request Error
    if (error instanceof BadRequestException) {
      throw new BadRequestException({
        status: 400,
        message: error.message
      });
    }

    // Default Internal Server Error
    throw new InternalServerErrorException({
      status: 500,
      message: error.message || 'Internal Server Error'
    });
  }
}