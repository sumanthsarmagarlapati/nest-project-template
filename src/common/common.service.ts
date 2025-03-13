import { Injectable } from "@nestjs/common";
import { v4 as uuidV4 } from "uuid";

@Injectable()
export class CommonService {
    constructor() { }

    async getCode(headers:any,repo: any, prefix: string) {
        const uuid = uuidV4().split("-")[0] // uuid is 36 charecyter uniq string in form of (8-4-4-4-12)
        const code=`${prefix}-${uuid}`.toUpperCase()
    }
}