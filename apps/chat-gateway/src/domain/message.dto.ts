import { IsNumber, IsString, IsUUID } from "class-validator";

export class MessageDto {
  @IsUUID()
  id: string;
  @IsString()
  message!: string;
  @IsString()
  first_name!: string;
  @IsString()
  last_name!: string;
  @IsUUID()
  room_id!: string;
  @IsNumber()
  created_at?: number;

  static toEntity(entity?: MessageDto) {
    const it = {
      id: entity.id,
      message: entity.message,
      room_id: entity.room_id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      created_at: entity?.created_at,
    };

    return it;
  }
}
