import { FlightStatus } from "@prisma/client"
import { IsDate, IsInt } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
import { TicketDto } from './TicketDto';
import { PlaneDto } from "./PlaneDto";
import { CityDto } from "./CityDto";

export class FlightDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsUUID()
    @IsNotEmpty()
    from_city_id: string;

    @IsUUID()
    @IsNotEmpty()
    to_city_id: string;


    @IsNotEmpty()
    start_flight_date: Date;

    @IsNotEmpty()
    end_flight_date: Date;

    @IsString()
    @IsNotEmpty()
    status: FlightStatus
    @IsInt()
    price: number

    @IsInt()
    available_seats: number
    plane_id: string

    from_city: CityDto

    to_city: CityDto

    plane: PlaneDto
    static toEntity(entity?: FlightDto) {
        const it = {
            from_city_id: entity.from_city_id,
            to_city_id: entity.to_city_id,
            start_flight_date: entity.start_flight_date,
            end_flight_date: entity.end_flight_date,
            status: entity.status,
            price: entity.price,
            available_seats: entity.available_seats,
            plane_id: entity.plane_id,
            from_city: CityDto.toEntity(entity.from_city),
            to_city: CityDto.toEntity(entity.to_city),
            plane: PlaneDto.toEntity(entity.plane)
        }
        return it;
    }
    static toEntities(arr?: FlightDto[]) {
        const it = arr.map(order => this.toEntity(order))
        return it
    }
}
