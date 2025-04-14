import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { USER_CODE } from 'src/common/common.codes';
import { CommonService } from 'src/common/common.service';
import { Like, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto, PaginatedUserResponseDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private commonService: CommonService
    ) { }

    async createUser(headers: any, body: CreateUserDto) {
        
        try {
            const existingUser = await this.userRepo.findOne({ where: { username: body.username } });

            if (existingUser) {
                throw new BadRequestException('User with this email or username already exists');
            }

            const code = await this.commonService.getCode(headers, this.userRepo, USER_CODE);
            body['code'] = code;

            const user = this.userRepo.create(body);

            await this.userRepo.save(user);
            
            return {
                status: 201,
                message: 'User created successfully',
            };
        } catch (error) {
                        
        }
    }

    async getAllUsers(query: PaginationQueryDto) {
        try {
            const { page = 1, limit = 10, search } = query;
            const skip = (page - 1) * limit;

            const queryBuilder = this.userRepo.createQueryBuilder('user');

            if (search) {
                queryBuilder.where([
                    { first_name: Like(`%${search}%`) },
                    { last_name: Like(`%${search}%`) },
                    { email: Like(`%${search}%`) },
                    { username: Like(`%${search}%`) }
                ]);
            }

            const [users, total] = await queryBuilder
                .skip(skip)
                .take(limit)
                .getManyAndCount();

            const responseData = plainToClass(PaginatedUserResponseDto, {
                records: users,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            }, { excludeExtraneousValues: true });

            return {
                status: 200,
                message: 'Users retrieved successfully',
                data: responseData
            };
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getUser(id: number) {
        try {
            const user = await this.userRepo.findOne({
                where: { id }
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

}
