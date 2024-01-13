import { Injectable } from '@nestjs/common';
import { Ticket, User } from '@prisma/client';
import { TicketReposService } from '@/src/domain/repos/ticket-repos.service';
import { FlightsReposService } from '@/src/domain/repos/flights-repos.service';

@Injectable()
export class TicketService {
  constructor(private ticketRepo: TicketReposService,
    private flightRepo: FlightsReposService) { }

  async getAllTickets() {
    return await this.ticketRepo.getAllTickets();
  }
  async getTicketById({ id }: Pick<Ticket, 'id'>) {
    return await this.ticketRepo.getTicketById({ id });
  }

  async getTicketsByUserId({ user_id }: Pick<Ticket, 'user_id'>) {
    return await this.ticketRepo.getTicketsByUserId({ user_id });
  }

  async getTicketsByFlightId({ flight_id }: Pick<Ticket, 'flight_id'>) {
    return await this.ticketRepo.getTicketsByFlightId({ flight_id });
  }

  async deleteTicketById(user: User, { id }: Pick<Ticket, 'id'>) {
    return await this.ticketRepo.deleteTicketById(user, { id });
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

  async createTicket(
    data: Pick<Ticket, 'flight_id' | 'holder_first_name' | 'holder_last_name'>,
    user: User
  ) {
    return await this.ticketRepo.createTicket(data, user);
  }
  async getRelevantFlightById(flight_id: Pick<Ticket, 'flight_id'>) {
    return this.flightRepo.getRelevantFlightById(flight_id);
  }
}
