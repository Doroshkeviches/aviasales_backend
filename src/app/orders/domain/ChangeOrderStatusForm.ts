import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { validate } from 'class-validator';

export class ChangeOrderStatusForm {
  @ApiProperty({
    description: 'order id',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'order status',
  })
  @IsString()
  @IsNotEmpty()
  status: OrderStatus;

  static from(form?: ChangeOrderStatusForm) {
    const it = new ChangeOrderStatusForm();
    it.id = form?.id
    it.status = form?.status;
    return it;
  }

  static async validate(form: ChangeOrderStatusForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
