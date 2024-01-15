import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class DeviceDto {
    @IsUUID()
    id: string
    @IsUUID()
    device_id: string
    
    created_at: Date

    updated_at: Date
    

    static toEntity(entity?: DeviceDto) {
        const it = {
          id: entity.id,
          device_id: entity.device_id,
          created_at: entity.created_at,
          updated_at: entity.updated_at,
        };
        return it;
      }
      static toEntities(arr?: DeviceDto[]) {
        const it = arr.map((order) => this.toEntity(order));
        return it;
      }
}