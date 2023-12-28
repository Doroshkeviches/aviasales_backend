import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';

export class SignUpForm {
  @ApiProperty({
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'First Name',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last Name',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'device id',
  })
  @IsUUID()
  device_id!: string;

  static from(form?: SignUpForm) {
    const it = new SignUpForm()
    it.email = form?.email;
    it.password = form?.password;
    it.first_name = form.first_name;
    it.last_name = form.last_name;
    it.device_id = form.device_id
    return it;
  }

  static async validate(form: SignUpForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
