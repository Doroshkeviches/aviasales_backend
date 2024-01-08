import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '@prisma/client';

export class CreateTicketForm {
  @ApiProperty({
    description: 'Correct flight_id',
  })
  @IsUUID()
  @IsNotEmpty()
  flight_id: string;

  @ApiProperty({
    description: 'Correct first name',
  })
  @IsString()
  @IsNotEmpty()
  holder_first_name: string;

  @ApiProperty({
    description: 'Correct last name',
  })
  @IsString()
  @IsNotEmpty()
  holder_last_name: string;

  static from(form: CreateTicketForm) {
    if (!form) {
      return;
    }
    const it = new CreateTicketForm();
    it.flight_id = form.flight_id;
    it.holder_first_name = form.holder_first_name;
    it.holder_last_name = form.holder_last_name;
    return it;
  }

  static async validate(form: CreateTicketForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
