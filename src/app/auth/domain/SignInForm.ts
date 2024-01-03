import { EmailErrorMessage, StrongPasswordErrorMessage, UuidErrorMessage } from '@/src/libs/exceptions/i18n-error';
import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, IsUUID, validate } from 'class-validator';

export class SignInForm {
    @ApiProperty({
        description: 'email',
    })
    @IsEmail()
    @IsEmail(undefined, {
      message: EmailErrorMessage,
    })
    email: string;

    @ApiProperty({
        description: 'password',
    })
    @IsStrongPassword(undefined, { message: StrongPasswordErrorMessage })
    password: string;

    @ApiProperty({
      description: 'device id',
    })
    @IsUUID(undefined, {
      message: UuidErrorMessage,
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
