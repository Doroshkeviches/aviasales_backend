import { IsDate, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FlightDto } from './flight.dto';

export class PathsDto {
  @ApiProperty({
    description: 'Correct from city',
  })
  @IsString()
  @IsNotEmpty()
  from_city: string;

  @ApiProperty({
    description: 'Correct to city',
  })
  @IsString()
  @IsNotEmpty()
  to_city: string;

  @ApiProperty({
    description: 'Correct to city',
  })
  @IsDate()
  start_date: Date;

  @ApiProperty({
    description: 'Correct to city',
  })
  @IsDate()
  end_date: Date;

  @ApiProperty({
    description: 'Correct total',
  })
  @IsInt()
  totalPrice: number;

  @IsNotEmpty()
  paths: FlightDto[];

  static toEntity(array?: FlightDto[]) {
    const it = {
      totalPrice: array.reduce((sum, item) => sum + item.price, 0),
      start_date: array.at(0).start_flight_date.valueOf(),
      end_date: array.at(-1).end_flight_date.valueOf(),
      from_city: array.at(0).from_city.title,
      to_city: array.at(-1).to_city.title,
      paths: array,
    };
    return it;
  }

  static toEntities(arr?: Array<FlightDto[]>) {
    const it = arr.map((path) => this.toEntity(path));
    return it;
  }
}
