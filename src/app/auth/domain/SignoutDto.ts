import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from "@prisma/client"
import { IsNotEmpty, IsString, validate } from 'class-validator';

export class SignoutDto {
    @ApiProperty({
        description: 'is Token Delete',
    })
    @IsString()
    @IsNotEmpty()
    isTokenDelete: boolean;

    static toEntity(entity?: SignoutDto) {
        const it = {
            isTokenDelete: entity.isTokenDelete,
        }
        return it;
    }
}
