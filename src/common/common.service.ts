import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Injectable()
export class CommonService {
    constructor() { }

    async getCode(repo: Repository<any>, prefix: string): Promise<string> {
        const uuidCode = uuidV4().split("-")[0];
        console.log("uuidV4", uuidV4);

        const code = `${prefix}-${uuidCode}`;

        const existingRecord = await repo.findOne({
            where: { code }, select: ["code", "id"]
        });

        if (existingRecord) await this.getCode(repo, prefix)
        return code;
    }
}