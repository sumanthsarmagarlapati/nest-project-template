import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_CODE } from 'src/common/common.codes';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    // constructor(
    //     @InjectModel('user')
    //     private readonly userRepo: Repository<User>,

    //     private commonService: CommonService
    // ) { }

    // 

}
