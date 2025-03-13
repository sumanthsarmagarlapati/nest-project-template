import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

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
