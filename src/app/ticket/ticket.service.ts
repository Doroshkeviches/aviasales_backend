import { Injectable } from '@nestjs/common';
import { Ticket, User } from '@prisma/client';
import { TicketReposService } from '@/src/domain/repos/ticket-repos.service';

@Injectable()
export class TicketService {
  constructor(private ticketRepo: TicketReposService) {}

  async getTicketById({ id }: Pick<Ticket, 'id'>) {
    return await this.ticketRepo.getTicketById({ id });
  }

  async getTicketsByOrderId({ order_id }: Pick<Ticket, 'order_id'>) {
    return await this.ticketRepo.getTicketsByOrderId({ order_id });
  }

  async getTicketsByFlightId({ flight_id }: Pick<Ticket, 'flight_id'>) {
    return await this.ticketRepo.getTicketsByFlightId({ flight_id });
  }

  async deleteTicketById({ id }: Pick<Ticket, 'id'>) {
    return await this.ticketRepo.deleteTicketById({ id });
  }

  async updateTicketStatusById(data: Pick<Ticket, 'id' | 'status'>) {
    return await this.ticketRepo.updateTicketStatusById(data);
  }

  async updateTicketHolderCredsById(
    user: User,
    data: Pick<Ticket, 'id' | 'holder_first_name' | 'holder_last_name'>
  ) {
    return await this.ticketRepo.updateTicketHolderCredsById(user, data);
  }

  // empty
  async createTicket() {
    return await this.ticketRepo.createTicket();
  }
}
