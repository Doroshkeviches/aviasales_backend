import { UuidErrorMessage } from 'apps/libs/exceptions/i18n-error';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';

export class ResetTokenDto {
    @ApiProperty({
        description: 'access-token',
    })
    @IsUUID()
    @IsUUID(undefined, {
        message: UuidErrorMessage,
    })
    token: string;

    static toEntity(entity?: ResetTokenDto) {
        const it = {
            token: entity.token,
        }
        return it;
    }
}
