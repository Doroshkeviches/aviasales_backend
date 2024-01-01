import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
import { FlightDto } from './FlightDto';

export class TicketDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    holder_first_name: string;

    @IsString()
    @IsNotEmpty()
    holder_last_name: string;

    @IsUUID()
    @IsNotEmpty()
    order_id: string;

    flight_id: string

    @IsNotEmpty()
    flight: FlightDto;

    static toEntity(entity?: TicketDto) {
        const it = {
            id: entity.id,
            holder_first_name: entity.holder_first_name,
            holder_last_name: entity.holder_last_name,
            flight: FlightDto.toEntity(entity.flight)
        }
        return it;
    }
    static toEntities(arr?: TicketDto[]) {
        const it = arr.map(order => this.toEntity(order))
        return it
    }
}
