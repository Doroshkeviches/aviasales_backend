import { IsArray } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { validate } from 'class-validator';

class TicketForm {
  @ApiProperty({
    description: 'flight_id',
  })
  @IsUUID()
  flight_id: string;

  @ApiProperty({
    description: 'holdet first name',
  })
  @IsString()
  @IsNotEmpty()
  holder_first_name: string;

  @ApiProperty({
    description: 'holdet_last_name',
  })
  @IsString()
  @IsNotEmpty()
  holder_last_name: string;

  static from(form?: TicketForm) {
    const it = new TicketForm();
    it.flight_id = form?.flight_id
    it.holder_first_name = form?.holder_first_name;
    it.holder_last_name = form?.holder_last_name;
    return it;
  }
}

export class CreateOrderForm {
  @IsArray()
  tickets: TicketForm[]

  static from(form?: CreateOrderForm) {
    const it = new CreateOrderForm();
    it.tickets = form?.tickets;
    return it;
  }

  static async validate(form: CreateOrderForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
