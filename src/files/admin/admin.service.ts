import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        // @InjectRepository(Admin)
        // private adminRepository: Repository<Admin>,
    ) {}
}
