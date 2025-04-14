import { Injectable } from "@nestjs/common";
import { v4 as uuidV4 } from "uuid";
import { Repository } from "typeorm";

@Injectable()
export class CommonService {
    constructor() { }

    async getCode(headers: any, repo: Repository<any>, prefix: string): Promise<string> {
        let isUnique = false;
        let code: string;

        while (!isUnique) {
            // Generate a random 6-digit number (to make total 10 digits with prefix)
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            code = `${prefix}${randomNum}`;

            // Check if code exists in the repository
            const existingRecord = await repo.findOne({
                where: { code }
            });

            if (!existingRecord) {
                isUnique = true;
            }
        }

        return code;
    }
}