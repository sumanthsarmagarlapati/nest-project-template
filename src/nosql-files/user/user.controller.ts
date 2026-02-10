import { Body, Controller, Get, Headers, Param, Patch, Post } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Headers() headers, @Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(":code")
  async getUser(@Param("code") code: string) {
    return this.userService.getUser(code);
  }

  @Patch(":code")
  async updateUser(@Param("code") code: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(code, body);
  }
}
