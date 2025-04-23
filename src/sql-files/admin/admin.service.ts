import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";
import { USER_CODE } from 'src/common/common.codes';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,

        private commonService: CommonService
    ) { }

    async createUser(body: Record<string, any>) {
        try {
            const existingUser = await this.adminRepo.findOne({ where: { username: body.username } });

            if (existingUser) {
                throw new BadRequestException('Admin with this email or username already exists');
            }

            if (body['password'] !== body['confirm_password']) {
                throw new BadRequestException("Password and confirm passwords are mismatch")
            }

            const saltValues = await bcrypt.genSalt()
            const hashValue = await bcrypt.hash(body.password, saltValues)
            body['password'] = hashValue

            const code = await this.commonService.getCode(this.adminRepo, USER_CODE);
            body['code'] = code;

            this.adminRepo.insert(body);

            return {
                status: 201,
                message: 'Admin created successfully',
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getAllUsers() {
        try {
            const data = await this.adminRepo.find({})

            return {
                status: 200,
                message: 'Users retrieved successfully',
                data: data
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getUser(code: string) {
        console.log(code);

        try {
            const user = await this.adminRepo.findOne({
                where: { code }
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return {
                status: 200,
                message: 'User retrieved successfully',
                data: user
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async updateUser(code: string, body: Record<string, any>) {
        try {
            const user = await this.adminRepo.findOne({
                where: { code }
            });
            console.log("user", user);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if ('current_password' in body && "new_password" in body) {
                const isPasswordValid = await bcrypt.compare(body.current_password, user.password);
                if (!isPasswordValid) {
                    throw new BadRequestException('Current password is incorrect');
                }

                const saltValues = await bcrypt.genSalt();
                const hashValue = await bcrypt.hash(body.new_password, saltValues);
                body.password = hashValue;
                delete body.current_password;
                delete body.new_password;
            }

            await this.adminRepo.update({ code }, body);

            return {
                status: 200,
                message: 'User updated successfully'
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
