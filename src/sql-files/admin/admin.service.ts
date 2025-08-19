import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { ADMIN_CODE } from "../../common/common.codes";
import { CommonService } from "../../common/common.service";
import { LogService } from "../../common/services/logService";
import { Admin } from "./entities/admin.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,

    private readonly commonService: CommonService,
    private readonly logService: LogService,
  ) {}

  async createUser(body: Record<string, any>) {
    try {
      const existingUser = await this.adminRepo.findOne({
        where: { username: body.username },
      });

      if (existingUser) {
        return this.logService.errorLog(
          new BadRequestException("Record with this username or email already exists"),
          "createAdmin",
        );
      }

      if (body.password !== body.confirm_password) {
        return this.logService.errorLog(
          new BadRequestException("Password and confirm password do not match"),
          "createAdmin",
        );
      }

      const saltValues = await bcrypt.genSalt();
      const hashValue = await bcrypt.hash(body.password, saltValues);
      body.password = hashValue;

      const code = await this.commonService.getCode(this.adminRepo, ADMIN_CODE);
      body.code = code;

      await this.adminRepo.insert(body);

      return {
        status: 201,
        message: "Admin created successfully",
      };
    } catch (error) {
      return this.logService.errorLog(error, "createAdmin");
    }
  }

  async getAllUsers() {
    try {
      const data = await this.adminRepo.find({
        select: {
          password: false,
        },
      });

      return {
        status: 200,
        message: "Admins retrieved successfully",
        data: data,
      };
    } catch (error) {
      return this.logService.errorLog(error, "getAllAdmins");
    }
  }

  async getUser(code: string) {
    try {
      const user = await this.adminRepo.findOne({
        where: { code },
        select: {
          password: false,
        },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      return {
        status: 200,
        message: "Admin retrieved successfully",
        data: user,
      };
    } catch (error) {
      return this.logService.errorLog(error, "getAdmin");
    }
  }

  async updateAdmin(code: string, body: Record<string, any>) {
    try {
      const user = await this.adminRepo.findOne({
        where: { code },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      if ("current_password" in body && "new_password" in body) {
        const isPasswordValid = await bcrypt.compare(body.current_password, user.password);
        if (!isPasswordValid) {
          throw new BadRequestException("Current password is incorrect");
        }

        const saltValues = await bcrypt.genSalt();
        body.password = await bcrypt.hash(body.new_password, saltValues);
        delete body.current_password;
        delete body.new_password;
      }

      await this.adminRepo.update({ code }, body);

      return {
        status: 200,
        message: "Admin updated successfully",
      };
    } catch (error) {
      return this.logService.errorLog(error, "updateAdmin");
    }
  }
}
