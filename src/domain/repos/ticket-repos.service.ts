import { Injectable } from '@nestjs/common';
import { Ticket, User, TicketStatus } from '@prisma/client';
import { PrismaService } from '@/src/libs/prisma/src';

@Injectable()
export class TicketReposService {
  constructor(private prisma: PrismaService) {}

  async getTicketById({ id }: Pick<Ticket, 'id'>) {
    return await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        flight: {
          include: {
            plane: true,
            from_city: true,
            to_city: true,
          },
        },
      },
    });
  }

  async getTicketsByUserId({ user_id }: Pick<Ticket, 'user_id'>) {
    return await this.prisma.ticket.findMany({
      where: { user_id },
      include: {
        flight: true,
      },
    });
  }

  async getTicketsInCartByUserId({ user_id }: Pick<Ticket, 'user_id'>) {
    return await this.prisma.ticket.findMany({
      where: { user_id, status: TicketStatus.InCart },
      include: {
        flight: true,
      },
    });
  }

  async getTicketsByFlightId({ flight_id }: Pick<Ticket, 'flight_id'>) {
    return await this.prisma.ticket.findMany({
      where: { flight_id },
    });
  }

  async deleteTicketById({ id }: Pick<Ticket, 'id'>) {
    return await this.prisma.ticket.delete({
      where: { id },
    });
  }

  async updateTicketStatusById(data: Pick<Ticket, 'id' | 'status'>) {
    const ticket = await this.prisma.ticket.update({
      where: { id: data.id },
      data: { status: data.status },
    });
    return ticket;
  }

  async updateTicketHolderCredsById(
    user: User,
    data: Pick<Ticket, 'id' | 'holder_first_name' | 'holder_last_name'>
  ) {
    const ticket = await this.prisma.ticket.update({
      where: {
        id: data.id,
        user_id: user.id,
      },
      data: {
        holder_first_name: data.holder_first_name,
        holder_last_name: data.holder_last_name,
      },
    });
    return ticket;
  }

  async createTicket(
    data: Pick<Ticket, 'flight_id' | 'holder_first_name' | 'holder_last_name'>,
    user: User
  ) {
    return await this.prisma.ticket.create({
      data: {
        user_id: user.id,
        holder_first_name: data.holder_first_name,
        holder_last_name: data.holder_last_name,
        flight_id: data.flight_id,
        status: TicketStatus.InCart,
      },
    });
  }
}
