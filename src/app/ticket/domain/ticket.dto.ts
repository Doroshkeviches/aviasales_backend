import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class TicketDto {
  @ApiProperty({
    description: 'Correct id',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Correct holder_first_name',
  })
  @IsString()
  @IsNotEmpty()
  holder_first_name: string;

  @ApiProperty({
    description: 'Correct holder_last_name',
  })
  @IsString()
  @IsNotEmpty()
  holder_last_name: string;

  @ApiProperty({
    description: 'Correct flight_id',
  })
  @IsUUID()
  @IsNotEmpty()
  flight_id: string;

  @ApiProperty({
    description: 'Correct user_id',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Correct status',
  })
  @IsString()
  @IsNotEmpty()
  status: TicketStatus;

  static toEntity(entity?: TicketDto) {
    const it = {
      id: entity.id,
      holder_first_name: entity.holder_first_name,
      holder_last_name: entity.holder_last_name,
      status: entity.status,
      flight_id: entity.flight_id,
      user_id: entity.user_id,
    };
    return it;
  }
  static toEntities(arr?: TicketDto[]) {
    const it = arr.map((order) => this.toEntity(order));
    return it;
  }
}
