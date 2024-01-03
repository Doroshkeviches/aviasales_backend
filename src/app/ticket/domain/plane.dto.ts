import { IsInt } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';

export class PlaneDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string

    @IsInt()
    seats: number

    static toEntity(entity?: PlaneDto) {
        const it = {
            id: entity.id,
            title: entity.title,
            seats: entity.seats,
        }
        return it;
    }
    static toEntities(arr?: PlaneDto[]) {
        const it = arr.map(order => this.toEntity(order))
        return it
    }
}
