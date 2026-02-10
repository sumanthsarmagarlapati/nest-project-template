import { SetMetadata } from "@nestjs/common"

export interface IAuthGuard {
    type?: 'bearer' | 'basic' | 'Custom',
    guard?: boolean,
    auth?: boolean
}

export interface IGuardOptions {
    authGuard: IAuthGuard,
    accessGuard: IAuthGuard
}

export const Guard_Options = 'guardOptions'
export const GuardOptions = (options: IGuardOptions) => SetMetadata(Guard_Options, options)