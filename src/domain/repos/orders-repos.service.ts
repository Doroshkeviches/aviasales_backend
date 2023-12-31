import { Injectable } from '@nestjs/common';
import { Order, OrderStatus, Ticket, User } from '@prisma/client';
import { PrismaService } from '@/src/libs/prisma/src';
import { user_id } from '@/src/types/user-id.type';


const includeTicketsFlights = () => {
    return {
      include: {
        tickets: {
          include: {
            flight: {
              include: {
                plane: true,
                from_city: true,
                to_city: true,
              },
            },
          },
        },
      },
    } as const;
  };


@Injectable()
export class OrdersRepoService {
    constructor(private prisma: PrismaService) { }
    async createOrder({ id }: Pick<User, 'id'>) {
        return this.prisma.order.create({
            data: {
                user_id: id,
                status: OrderStatus.InProcess,
            },
            ...includeTicketsFlights()
        })
    }
    async changeOrderStatus(data: Pick<Order, 'id' | 'status'>) {
        return this.prisma.order.update({
            where: { id: data.id },
            data: {
                status: data.status
            },
            ...includeTicketsFlights()
        })
    }
    async getOrderById({ id }: Pick<Order, 'id'>) {
        return this.prisma.order.findUnique({
            where: { id },
            ...includeTicketsFlights()
        })
    }
    async getOrdersByUserId({ id }: user_id) {
        return this.prisma.order.findMany({
            where: { user_id: id },
            ...includeTicketsFlights()
        })
    }
    async deleteOrderById(user: user_id, { id }: Pick<Order, 'id'>) {
        return this.prisma.order.delete({
            where: {
                id,
                user_id: user.id
            }
        })
    }
    async getActiveOrdersByUserId({ id }: Pick<User, 'id'>) {
        return this.prisma.order.findFirst({
            where: {
                user_id: id,
                status: OrderStatus.InProcess
            },
            ...includeTicketsFlights()
        })
    }
}