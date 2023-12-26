import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from "@prisma/client"
import { IsNotEmpty, IsString, validate } from 'class-validator';

export class SignInForm {
    @ApiProperty({
        description: 'email',
    })
    email: string;

    @ApiProperty({
        description: 'password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    static from(form?: SignInForm) {
        const it = {
          email: form?.email,
          password: form?.password,
        };
        return it;
      }
    
      static async validate(form: SignInForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
      }
}
