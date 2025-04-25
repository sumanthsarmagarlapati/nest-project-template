import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { USER_CODE } from 'src/common/common.codes';
import { CommonService } from 'src/common/common.service';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { ApiInterface } from 'src/common/common.interface';
import { LogService } from 'src/common/services/logService';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('user')
    private readonly userRepo: Model<User>,

    private commonService: CommonService,
    private logService: LogService,
  ) {}

  //
  async createUser(body: Record<string, any>):Promise<ApiInterface> {
    console.log("body",body);
    try {
      const existingUser = await this.userRepo.findOne({ username: body.username });

      if (existingUser) {
        return this.logService.errorLog(
          new BadRequestException('Record with this username or email already exists'),
          'createUser'
        );
      }

      if (body.password !== body.confirm_password) {
        return this.logService.errorLog(
          new BadRequestException('Password and confirm password do not match'),
          'createUser'
        );
      }

      const saltValues = await bcrypt.genSalt();
      const hashValue = await bcrypt.hash(body.password, saltValues);
      body['password'] = hashValue;

      const code = await this.commonService.getCode(this.userRepo, USER_CODE);
      body['code'] = code;

      await this.userRepo.create(body);

      return {
        status: 201,
        message: 'Admin created successfully',
      };
    } catch (error) {
      return this.logService.errorLog(error, 'createUser');
    }
  }

  async getAllUsers():Promise<ApiInterface> {
    try {
      const users = await this.userRepo.find({}, { password: 0 }); // Exclude password field

      return {
        status: 200,
        message: 'Users retrieved successfully',
        data: users
      };
    } catch (error) {
      return this.logService.errorLog(error, 'getAllUsers');
    }
  }

  async getUser(code: string):Promise<ApiInterface> {
    try {
      const user = await this.userRepo.findOne({ code }, { password: 0 }); // Exclude password

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        status: 200,
        message: 'User retrieved successfully',
        data: user
      };
    } catch (error) {
      return this.logService.errorLog(error, 'getUser');
    }
  }

  async updateUser(code: string, body: Record<string, any>):Promise<ApiInterface> {
    try {
      const user = await this.userRepo.findOne({ code });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Handle password update if provided
      if ('current_password' in body && 'new_password' in body) {
        const isPasswordValid = await bcrypt.compare(
          body.current_password,
          user.password
        );
        if (!isPasswordValid) {
          throw new BadRequestException('Current password is incorrect');
        }

        const saltValues = await bcrypt.genSalt();
        const hashValue = await bcrypt.hash(body.new_password, saltValues);
        body.password = hashValue;
        delete body.current_password;
        delete body.new_password;
      }

      // Update user
      await this.userRepo.updateOne({ code }, { $set: body });

      return {
        status: 200,
        message: 'User updated successfully'
      };
    } catch (error) {
      return this.logService.errorLog(error, 'getUser');
    }
  }
}
