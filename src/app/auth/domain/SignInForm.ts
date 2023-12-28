import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';

export class SignInForm {
    @ApiProperty({
        description: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
      description: 'device id',
    })
    @IsUUID(undefined, {
      // message: UuidErrorMessage,
    })
    device_id!: string;

    static from(form?: SignInForm) {
      const it = new SignInForm();
      it.email = form?.email;
      it.password = form?.password;
      it.device_id = form?.device_id;
      return it;
    }
    
    static async validate(form: SignInForm) {
      const errors = await validate(form);
      return errors.length ? errors : false;
    }
}
