import { Injectable } from '@nestjs/common';
import { Order, Ticket } from '@prisma/client';
import { PrismaService } from '@/src/libs/prisma/src';

@Injectable()
export class TicketsRepoService {
    constructor(private prisma: PrismaService) { }
    async createTicket(data: Pick<Ticket, 'flight_id' | 'holder_last_name' | 'holder_first_name'>[], order: Order) {
        console.log(data, order.id)
        return await this.prisma.$transaction(async (tx) => {
            const tickets = await Promise.all(
                data.map(async (ticket) => {
                    return await tx.ticket.create({
                        data: {
                            ...ticket,
                            order_id: order.id
                        },
                        include: {
                            flight: {
                                include: {
                                    plane: true,
                                    from_city:true,
                                    to_city: true
                                }
                            }
                        },
                    })
                })
            )
            return tickets
        })
    }
    async deleteTicket({ id }: Pick<Ticket, 'id'>) {
        return this.prisma.ticket.delete({
            where: { id }
        })
    }
}