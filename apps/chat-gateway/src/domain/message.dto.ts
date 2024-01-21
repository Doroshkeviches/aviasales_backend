import { IsString, IsUUID } from "class-validator";

export class MessageDto {
  @IsUUID()
  id: string;
  @IsString()
  message: string;
  @IsString()
  from_id: string;
  @IsUUID()
  room_id: string;
  created_at?: number;

  static toEntity(entity?: MessageDto) {
    const it = {
      id: entity.id,
      message: entity.message,
      room_id: entity.room_id,
      from_id: entity?.from_id,
      created_at: entity?.created_at,
    };

    return it;
  }
}