import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from "process";
import { Guard_Options, IGuardOptions } from "src/utils/guard.decarator";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) {

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        try {
            const guardOptions = this.reflector.get<IGuardOptions>(Guard_Options, context.getHandler())

            if (guardOptions.authGuard.auth == false) return true;
            if (guardOptions.authGuard.type === 'bearer') return await this.validateBearerToken(request);
            if (['CODE', 'CUSTOM'].includes(guardOptions?.authGuard?.type ?? "")) {
                const token = request?.query?.code ?? request?.body?.refresh_token
                if (!token) throw new BadRequestException("Authentication Requires")
                request['headers']['authorization'] = `Bearer ${token}`;

                if (guardOptions?.authGuard?.type == 'basic') return await this.validateBearerToken(request);
                if (guardOptions?.authGuard?.type == 'Custom') return await this.validateBearerToken(request);
            }
            return await this.validateBearerToken(request);
        } catch (error) {

        }
    }

    async validateBearerToken(request: Request): Promise<boolean> {
        if (!request['headers']['authorization']) throw new BadRequestException("Authentication Required")

        const [tokenType, type] = request['headers']['authorization'].split(" ") ?? []
        const payload: any = this.jwtService.verifyAsync(tokenType, { secret: env.jwtSecret })
        try {
            return true;
        } catch (error) {
            return false;
        }
    }
}