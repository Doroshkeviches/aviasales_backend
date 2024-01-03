import { EmailErrorMessage, StrongPasswordErrorMessage, UuidErrorMessage } from '@/src/libs/exceptions/i18n-error';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, IsUUID, NotEquals, validate } from 'class-validator';

export class ResetPasswordForm {
    @ApiProperty({
        description: 'email',
    })
    @IsEmail(undefined, {
        message: EmailErrorMessage,
    })
    email!: string;

    @ApiProperty({
        description: 'device id',
    })
    @IsUUID(undefined, {
        message: UuidErrorMessage,
    })
    device_id!: string;

    @ApiProperty({
        description: 'password',
    })
    @IsStrongPassword(undefined, { message: StrongPasswordErrorMessage })
    password!: string;

    @ApiProperty({
        description: 'confirm password',
    })
    @IsStrongPassword(undefined, { message: StrongPasswordErrorMessage })
    @NotEquals('password', {
        message: 'Current password should not match with new password',
      })
    password_confirm!: string;

    @ApiProperty({
        description: 'reset token',
    })
    @IsUUID(undefined, {
        message: UuidErrorMessage,
    })
    refresh_token!: string;

    static from(form?: ResetPasswordForm) {
        const it = new ResetPasswordForm();
        it.email = form?.email;
        it.device_id = form?.device_id;
        it.password = form?.password;
        it.password_confirm = form?.password_confirm;
        it.refresh_token = form?.refresh_token;
        return it;
    }

    static async validate(form: ResetPasswordForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }
}
