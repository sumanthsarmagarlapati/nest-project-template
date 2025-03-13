import { Body, Controller, Post,Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(@Headers() headers: any, @Body() body: CreateUserDto) {
    return this.userService.createUser(headers,body)
  }
}