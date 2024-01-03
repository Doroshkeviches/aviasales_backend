// import { ApiProperty } from '@nestjs/swagger';
// import { Order, OrderStatus } from '@prisma/client';
// import { IsNotEmpty, IsString, IsUUID, validate } from 'class-validator';
// import { TicketDto } from '../../ticket/domain/ticket.dto';

// export class OrderDto {
//     @IsUUID()
//     @IsNotEmpty()
//     id: string;

//     user_id: string
//     @IsString()
//     @IsNotEmpty()
//     status: OrderStatus;

//     tickets: TicketDto[]

//     static toEntity(entity?: OrderDto) {
//         const it = {
//             id: entity.id,
//             status: entity.status,
//             tickets: TicketDto.toEntities(entity.tickets),
//         }
//         return it;
//     }
//     static toEntities(arr?: OrderDto[]) {
//         const it = arr.map(order => this.toEntity(order))
//         return it
//     }
// }
