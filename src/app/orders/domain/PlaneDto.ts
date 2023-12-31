"flight"
import { FlightStatus } from "@prisma/client"
import { IsDate, IsInt } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
import { TicketDto } from './TicketDto';

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
