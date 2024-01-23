import { IsNotEmpty, IsString, IsUUID, validate } from "class-validator";
import { v4 } from "uuid";

export class MessageForm {
  id: string;
  created_at: number;
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsUUID()
  @IsNotEmpty()
  room_id: string;

  static from(form: MessageForm) {
    if (!form) {
      return;
    }
    const it = new MessageForm();
    it.message = form.message;
    it.first_name = form.first_name;
    it.last_name = form.last_name;
    it.room_id = form.room_id;
    it.id = v4();
    it.created_at = new Date().getTime();
    return it;
  }

  static async validate(form: MessageForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
