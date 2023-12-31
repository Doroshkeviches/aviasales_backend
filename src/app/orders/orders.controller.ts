import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOrderForm } from './domain/CreateOrderForm';
import { CurrentUser, JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
import { User } from '@prisma/client';
import { ChangeOrderStatusForm } from './domain/ChangeOrderStatusForm';
import { OrderDto } from './domain/OrderDto';
import { ApiException } from '@/src/libs/exceptions/api-exception';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Successfully created a new user',
        type: CreateOrderForm,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: CreateOrderForm })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrder(@CurrentUser() user: User, @Body() body: CreateOrderForm) {
        const form = CreateOrderForm.from(body)
        const errors = await CreateOrderForm.validate(form)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        let active_order = await this.ordersService.getActiveOrderByUserId(user)
        if (active_order) {
            const ticket = await this.ordersService.createTicket(form.tickets, active_order)
            return ticket
        }
        const new_order = await this.ordersService.createOrder(user, form.tickets)
        return OrderDto.toEntity(new_order) //maybe change to other DTO (need test)

    }


    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Successfully created a new user',
        type: ChangeOrderStatusForm,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: ChangeOrderStatusForm })
    @Put()
    async updateOrderStatus(@CurrentUser() user: User, @Body() body: ChangeOrderStatusForm) {
        const form = ChangeOrderStatusForm.from(body)
        const errors = await ChangeOrderStatusForm.validate(form)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        const updatedOrder = await this.ordersService.changeOrderStatus(form)
        return OrderDto.toEntity(updatedOrder)

    }


    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Successfully deleted an order',
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @Delete(':id')
    async deleteOrderById(@CurrentUser() user: User, @Param("id") id: string) {
        const deletedOrder = await this.ordersService.deleteOrderById(user, { id })
        if(!deletedOrder) {
            throw new ApiException(ErrorCodes.Error) // TODO change to normal error
        }
        return true
    }

    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Successfully deleted an order',
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getOrdersByUserId(@CurrentUser() user: User) {
        const userOrders = await this.ordersService.getOrdersByUserId(user)
        return OrderDto.toEntities(userOrders)
    }

}
