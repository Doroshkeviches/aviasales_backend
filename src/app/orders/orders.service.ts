import { OrdersRepoService } from '@/src/domain/repos/orders-repos.service';
import { TicketsRepoService } from '@/src/domain/repos/tickets-repos.service';
import { user_id } from '@/src/types/user-id.type';
import { Injectable } from '@nestjs/common';
import { Order, Ticket, User } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(
        private ordersRepo: OrdersRepoService,
        private ticketsRepo: TicketsRepoService) { }

    async createOrder(id: Pick<User, 'id'>, data: Pick<Ticket, 'flight_id' | 'holder_first_name' | 'holder_last_name'>[]) {
        const order = await this.ordersRepo.createOrder(id)
        const ticket = await this.createTicket(data, order)
        return order
    }
    async getActiveOrderByUserId(id: Pick<User, 'id'>) {
        return this.ordersRepo.getActiveOrdersByUserId(id)
    }
    async createTicket(data: Pick<Ticket, 'flight_id' | 'holder_first_name' | 'holder_last_name'>[], order: Order) {
        return this.ticketsRepo.createTicket(data, order)
        //TODO add decrement on flight (after merging a flight-repo into dev branch)
    }
    async changeOrderStatus(data: Pick<Order, 'id' | 'status'>) {
        return this.ordersRepo.changeOrderStatus(data)
    }

    async deleteOrderById(user: user_id, id: Pick<Order, 'id'>) {
        return this.ordersRepo.deleteOrderById(user, id)
    }

    async getOrdersByUserId(id: user_id) {
        return this.ordersRepo.getOrdersByUserId(id)
    }
}
