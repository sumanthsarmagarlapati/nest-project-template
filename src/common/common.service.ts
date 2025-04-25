import { Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import { Repository } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Injectable()
export class CommonService {
    constructor() { }

    async getCode(repo: Repository<any> | Model<any>, prefix: string): Promise<string> {
        try {
            const uuidCode = uuidV4().split("-")[0];
            const code = `${prefix}-${uuidCode}`;
            
            // Check if it's a Mongoose Model
            if (repo instanceof Model) {
                const existingDoc = await repo.findOne({ code });
                if (!existingDoc) return code;
            } 
            // Check if it's a TypeORM Repository
            else if ('findOne' in repo) {
                const existingDoc = await repo.findOne({ where: { code } });
                if (!existingDoc) return code;
            }

            // If code exists, generate a new one recursively
            return this.getCode(repo, prefix);
        } catch (error) {
            throw new Error(`Failed to generate code: ${error.message}`);
        }
    }
}