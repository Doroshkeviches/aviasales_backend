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

  async getActiveTicketsByUserId(data: Pick<User, 'id'>) {
    return await this.ticketRepo.getActiveTicketsByUserId(data);
  }
  async getTicketsInCartByUserId(user: User) {
    return await this.ticketRepo.getTicketsInCartByUserId(user)
  }
  async updateTicketsStatus(ticket: Ticket[]) {
    return await this.ticketRepo.updateTicketsStatus(ticket);
  }
  async getTicketsByFlightId({ flight_id }: Pick<Ticket, 'flight_id'>) {
    return await this.ticketRepo.getTicketsByFlightId({ flight_id });
  }

  async deleteTicketById(user: User, { id }: Pick<Ticket, 'id'>) {
    const deletedTicket = await this.ticketRepo.deleteTicketById(user, { id });
    await this.flightRepo.incrementAvailableSeats(deletedTicket)
    return deletedTicket
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
    data: Pick<Ticket, 'holder_first_name' | 'holder_last_name'>,
    flights: string[],
    user: User
  ) {
    return await this.ticketRepo.createTicket(data, flights, user);
  }
  async getRelevantFlightsById(flights: string[]) {
    return this.flightRepo.getRelevantFlightsById(flights);
  }
  async decrementAvailableSeats(tickets: Ticket[]) {
    return await this.flightRepo.decrementAvailableSeats(tickets)
  }

}
