import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserRoles } from '@prisma/client';
import { TicketDto } from '../../ticket/domain/ticket.dto';

export class UserDto {
  @ApiProperty({
    description: 'Correct id',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Correct first name',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Correct last name',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Correct role id',
  })
  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @IsNotEmpty()
  role_type: UserRoles;

  @ApiProperty({
    description: 'Correct email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Correct password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  tickets: TicketDto[];

  static toEntity(entity?: UserDto) {
    const it = {
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      role_id: entity.role_id,
      role_type: entity.role_type,
      email: entity.email,
      password: entity.password,
      tickets: entity.tickets,
    };
    return it;
  }
  static toEntities(arr?: UserDto[]) {
    const it = arr.map((user) => this.toEntity(user));
    return it;
  }
}
