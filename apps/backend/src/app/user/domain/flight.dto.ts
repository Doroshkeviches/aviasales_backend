import { FlightStatus } from '@prisma/client';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PlaneDto } from './plane.dto';
import { CityDto } from './city.dto';

export class FlightDto {
  @ApiProperty({
    description: 'Correct id',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Correct from_city_id',
  })
  @IsUUID()
  @IsNotEmpty()
  from_city_id: string;

  @ApiProperty({
    description: 'Correct to_city_id',
  })
  @IsUUID()
  @IsNotEmpty()
  to_city_id: string;

  @ApiProperty({
    description: 'Correct start_flight_date',
  })
  @IsNotEmpty()
  start_flight_date: Date;

  @ApiProperty({
    description: 'Correct end_flight_date',
  })
  @IsNotEmpty()
  end_flight_date: Date;

  @ApiProperty({
    description: 'Correct status',
  })
  @IsString()
  @IsNotEmpty()
  status: FlightStatus;

  @ApiProperty({
    description: 'Correct price',
  })
  @IsInt()
  price: number;

  @ApiProperty({
    description: 'Correct available_seats',
  })
  @IsInt()
  available_seats: number;

  @ApiProperty({
    description: 'Correct plane_id',
  })
  @IsUUID()
  @IsNotEmpty()
  plane_id: string;

  from_city: CityDto;

  to_city: CityDto;

  plane: PlaneDto;

  static toEntity(entity?: FlightDto) {
    const it = {
      from_city_id: entity.from_city_id,
      to_city_id: entity.to_city_id,
      start_flight_date: entity.start_flight_date.valueOf(),
      end_flight_date: entity.end_flight_date.valueOf(),
      status: entity.status,
      price: entity.price,
      available_seats: entity.available_seats,
      from_city: entity.from_city.title,
      to_city: entity.to_city.title,
      plane: entity.plane.title,
    };
    return it;
  }
  static toEntities(arr?: FlightDto[]) {
    const it = arr.map((order) => this.toEntity(order));
    return it;
  }
}
