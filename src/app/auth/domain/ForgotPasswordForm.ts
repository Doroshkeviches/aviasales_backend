import { IsEmail, IsUUID } from 'class-validator';
import { validate } from 'class-validator';

export class ForgotPasswordForm {
  @IsUUID()
  device_id: string;

  @IsEmail()
  email: string;

  static from(dto: ForgotPasswordForm) {
    const it = new ForgotPasswordForm();
    it.email = dto.email;
    it.device_id = dto.device_id;
    return it;
  }

  static async validate(form: ForgotPasswordForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
