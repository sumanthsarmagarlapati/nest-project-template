import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_CODE } from 'src/common/common.codes';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private commonService: CommonService

    ) {

    }

    async createUser(headers: any, body: Record<string, any>) {
        try {
            const code = await this.commonService.getCode(headers, this.userRepo, USER_CODE);

            const user = {
                username: body['username']
            }
        } catch (error) {

        }
    }
}
