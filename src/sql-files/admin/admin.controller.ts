import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CommonCodeDto } from 'src/common/dto/common.dto';
import { AdminService } from './admin.service';
import {
    CreateUserDto,
    UpdateUserDto
} from './dto/admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    async createUser( @Body() body: CreateUserDto) {
        return this.adminService.createUser( body);
    }

    @Get()
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Get(":code")
    async getUser( @Param() param: CommonCodeDto) {
        return this.adminService.getUser( param.code);
    }

    @Patch(":code")
    async updateUser( @Param() param: CommonCodeDto, @Body() body: UpdateUserDto) {
        return this.adminService.updateUser( param.code, body);
    }
}