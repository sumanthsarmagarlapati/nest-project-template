import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, IsOptional, IsNumber, Min } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

// Request DTOs
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @Matches(/^[a-zA-Z@_-\s]+$/, {
        message: 'First Name can only contain uppercase and lowercase letters, spaces, and special characters _ - @',
    })
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @Matches(/^[a-zA-Z@_-\s]+$/, {
        message: 'Last Name can only contain uppercase and lowercase letters, spaces, and special characters _ - @',
    })
    last_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @Matches(/^[a-zA-Z0-9@_-\s]+$/, {
        message: 'Username can only contain letters, numbers, spaces, and special characters _ - @',
    })
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    mobile: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    })
    @MinLength(8)
    @MaxLength(20)
    password: string;
}

export class UpdateUserDto extends Partial<CreateUserDto> {}

export class PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;
}

@Exclude()
export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    first_name: string;

    @Expose()
    last_name: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    mobile: string;

    @Expose()
    code: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T | null;
}

export interface UserApiResponse extends ApiResponse<UserResponseDto> {}
export interface UsersApiResponse extends ApiResponse<PaginatedUserResponseDto> {}
export interface DeleteUserResponse extends ApiResponse<{ deleted: boolean }> {}

export class PaginatedUserResponseDto {
    @Expose()
    records: UserResponseDto[];

    @Expose()
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}
