import { IsNotEmpty, IsString, validate } from "class-validator";

export class CityForm {
  @IsString()
  @IsNotEmpty()
  title: string;

  static from(form: CityForm) {
    if (!form) {
      return;
    }
    const it = new CityForm();
    it.title = form.title;
    return it;
  }

  static async validate(form: CityForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
