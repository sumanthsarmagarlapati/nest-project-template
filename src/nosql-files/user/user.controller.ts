import { Body, Controller, Post, Headers, Get, Put, Delete, Param, Query } from '@nestjs/common';
import { 
    CreateUserDto, 
    UpdateUserDto, 
    PaginationQueryDto, 
    UserApiResponse, 
    UsersApiResponse, 
    DeleteUserResponse 
} from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(
        @Headers() headers: any,
        @Body() body: CreateUserDto
    ) {
        return this.userService.createUser(headers, body);
    }

    @Get()
    async getAllUsers(
        @Query() query: PaginationQueryDto
    ) {
        return this.userService.getAllUsers(query);
    }

    @Get(':id')
    async getUser(
        @Param('id') id: number
    ): Promise<UserApiResponse> {
        return this.userService.getUser(id);
    }

}