import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, validate } from "class-validator";
import { UuidErrorMessage } from "@app/exceptions/i18n-error";

export class ResetTokenDto {
  @ApiProperty({
    description: "access-token",
  })
  @IsUUID()
  @IsUUID(undefined, {
    message: UuidErrorMessage,
  })
  token: string;

  static toEntity(entity?: ResetTokenDto) {
    const it = {
      token: entity.token,
    };
    return it;
  }
}
