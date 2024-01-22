<<<<<<< HEAD
import { Injectable } from "@nestjs/common";
import { Ticket, User } from "@prisma/client";
import { TicketReposService } from "@backend/domain/repos/ticket-repos.service";
import { FlightsRepoService } from "@backend/domain/repos/flights-repos.service";

@Injectable()
export class TicketService {
  constructor(
    private ticketRepo: TicketReposService,
    private flightRepo: FlightsRepoService,
  ) {}
=======
import { Injectable } from '@nestjs/common';
import { Ticket, User } from '@prisma/client';
import { TicketReposService } from '@/src/domain/repos/ticket-repos.service';
import { FlightsReposService } from '@/src/domain/repos/flights-repos.service';

@Injectable()
export class TicketService {
  constructor(private ticketRepo: TicketReposService,
    private flightRepo: FlightsReposService) { }
>>>>>>> 15fc22f05449d6b28ca56875aeb24018c7b91ffd

  async getAllTickets() {
    return await this.ticketRepo.getAllTickets();
  }
  async getTicketById({ id }: Pick<Ticket, "id">) {
    return await this.ticketRepo.getTicketById({ id });
  }

<<<<<<< HEAD
  async getTicketsByUserId({ user_id }: Pick<Ticket, "user_id">) {
    return await this.ticketRepo.getTicketsByUserId({ user_id });
  }

  async getTicketsByFlightId({ flight_id }: Pick<Ticket, "flight_id">) {
    return await this.ticketRepo.getTicketsByFlightId({ flight_id });
  }

  async deleteTicketById(user: User, { id }: Pick<Ticket, "id">) {
    return await this.ticketRepo.deleteTicketById(user, { id });
  }

  async updateTicketStatusById(data: Pick<Ticket, "id" | "status">) {
=======
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
    return deletedTicket
  }
  async deleteOrderedTicketById(user: User, { id }: Pick<Ticket, 'id'>) {
    const deletedTicket = await this.ticketRepo.deleteOrderedTicketById(user, { id });
    await this.flightRepo.incrementAvailableSeats(deletedTicket)
    return deletedTicket
  }
  async updateTicketStatusById(data: Pick<Ticket, 'id' | 'status'>) {
>>>>>>> 15fc22f05449d6b28ca56875aeb24018c7b91ffd
    return await this.ticketRepo.updateTicketStatusById(data);
  }

  async updateTicketHolderCredsById(
    user: User,
    data: Pick<Ticket, "id" | "holder_first_name" | "holder_last_name">,
  ) {
    return await this.ticketRepo.updateTicketHolderCredsById(user, data);
  }

  async createTicket(
<<<<<<< HEAD
    data: Pick<Ticket, "flight_id" | "holder_first_name" | "holder_last_name">,
    user: User,
=======
    data: Pick<Ticket, 'holder_first_name' | 'holder_last_name'>,
    flights: string[],
    user: User
>>>>>>> 15fc22f05449d6b28ca56875aeb24018c7b91ffd
  ) {
    return await this.ticketRepo.createTicket(data, flights, user);
  }
  async getRelevantFlightsById(flights: string[]) {
    return this.flightRepo.getRelevantFlightsById(flights);
  }
<<<<<<< HEAD
  async getRelevantFlightById(flight_id: Pick<Ticket, "flight_id">) {
    return this.flightRepo.getRelevantFlightById(flight_id);
=======
  async decrementAvailableSeats(tickets: Ticket[]) {
    return await this.flightRepo.decrementAvailableSeats(tickets)
>>>>>>> 15fc22f05449d6b28ca56875aeb24018c7b91ffd
  }

}
