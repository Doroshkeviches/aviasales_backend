import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserForm {
  @ApiProperty({
    description: ' id',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Correct first name',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({
    description: 'Correct last name',
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    description: 'Correct last name',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  static from(form?: UpdateUserForm) {
    const it = new UpdateUserForm();
    it.id = form.id;
    it.first_name = form.first_name;
    it.last_name = form.last_name;
    it.email = form.email;

    return it;
  }

  static async validate(form: UpdateUserForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
