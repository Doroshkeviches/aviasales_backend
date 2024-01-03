import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { UpdateTicketCredsForm } from './domain/update-ticket-creds.form';
import { UpdateTicketStatusForm } from './domain/update-ticket-status.form';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import {
  CurrentUser,
  JwtAuthGuard,
} from '@/src/libs/security/guards/security.guard';
import { User } from '.prisma/client';
import { TicketDto } from '../orders/domain/TicketDto';
import { RequirePermissions } from '@/src/libs/security/decorators/permission.decorator';
import { UserPermissions } from '@prisma/client';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfully get single ticket',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetTicketById)
  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    const ticket = await this.ticketService.getTicketById({ id });
    return TicketDto.toEntity(ticket);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully get tickets from order',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetTicketsByOrderId)
  @Get(':order_id')
  async getTicketsByOrderId(@Param('order_id') order_id: string) {
    return await this.ticketService.getTicketsByOrderId({ order_id });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully get tickets from flight',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetTicketsByFlightId)
  @Get(':flight_id')
  async getTicketsByFlightId(@Param('flight_id') flight_id: string) {
    return await this.ticketService.getTicketsByFlightId({ flight_id });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully delete ticket by id',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.DeleteTicketById)
  @Delete(':id')
  async deleteTicketById(@Param('id') id: string) {
    return await this.ticketService.deleteTicketById({ id });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update ticket holder credentials',
  })
  @Put()
  @HttpCode(200)
  @ApiBody({ type: UpdateTicketCredsForm })
  async updateTicketHolderCredsById(
    @CurrentUser() user: User,
    @Body() body: UpdateTicketCredsForm
  ) {
    const form = UpdateTicketCredsForm.from(body);
    const errors = await UpdateTicketCredsForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    return await this.ticketService.updateTicketHolderCredsById(user, body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update ticket status',
  })
  @Put()
  @HttpCode(200)
  @ApiBody({ type: UpdateTicketStatusForm })
  async updateTicketStatusById(@Body() body: UpdateTicketStatusForm) {
    const form = UpdateTicketStatusForm.from(body);
    const errors = await UpdateTicketStatusForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    return await this.ticketService.updateTicketStatusById(body);
  }
}
