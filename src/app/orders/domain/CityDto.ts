import { IsString, IsUUID } from "class-validator";
import { PlaneDto } from "./PlaneDto";

export class CityDto {

    @IsUUID()
    id: string
    @IsString()
    title: string

    static toEntity(entity?: CityDto) {
        const it = {
            id: entity.id,
            title: entity.title,
        }
        return it;
    }
    static toEntities(arr?: CityDto[]) {
        const it = arr.map(order => this.toEntity(order))
        return it
    }
}
