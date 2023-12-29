import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';

export class ResetTokenDto {
    @ApiProperty({
        description: 'access-token',
    })
    @IsUUID()
    @IsNotEmpty()
    token: string;

    static toEntity(entity?: ResetTokenDto) {
        const it = {
            token: entity.token,
        }
        return it;
    }
}
