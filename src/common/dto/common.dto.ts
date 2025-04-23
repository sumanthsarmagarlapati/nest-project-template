import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

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

export class CommonCodeDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(12)
    @MaxLength(12)
    code: string
}