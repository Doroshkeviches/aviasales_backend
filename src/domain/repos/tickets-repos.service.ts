import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from '@/src/libs/prisma/src';

@Injectable()
export class TicketsRepoService {
    constructor(private prisma: PrismaService) { }
    async createTicket(data: Pick<Ticket, 'flight_id' | 'holder_last_name' | 'holdet_first_name' | 'order_id'>) {
        return this.prisma.ticket.create({
            data
        })
    }
    async deleteTicket({ id }: Pick<Ticket, 'id'>) {
        return this.prisma.ticket.delete({
            where: { id }
        })
    }
}