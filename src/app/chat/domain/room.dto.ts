import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RoomDto {
    @IsString()
    @ApiProperty({
        description: 'room id',
    })
    id!: string;
}