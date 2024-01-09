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
import { User } from '.prisma/client';
import { TicketDto } from './domain/ticket.dto';
import { CreateTicketForm } from './domain/create-ticket.form';
import { UserPermissions } from '@prisma/client';
import {CurrentUser, JwtAuthGuard} from "@app/security/../../../../../libs/security/guards/security.guard";
import {RequirePermissions} from "@app/security/../../../../../libs/security/decorators/permission.decorator";
import {ApiException} from "@app/exceptions/api-exception";
import {ApiRequestException} from "@app/exceptions/api-request-exception";

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get all tickets',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetAllTickets)
  @Get()
  async getAllTickets() {
    const tickets = await this.ticketService.getAllTickets();
    if (!tickets) throw new ApiException(ErrorCodes.NoTickets);
    return TicketDto.toEntities(tickets);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get single ticket',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetTicketById)
  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    const ticket = await this.ticketService.getTicketById({ id });
    if (!ticket) throw new ApiException(ErrorCodes.NoTicket);
    return TicketDto.toEntity(ticket);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully delete ticket by id',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.DeleteTicketById)
  @Delete(':id')
  async deleteTicketById(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.ticketService.deleteTicketById(user, { id });
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully update ticket holder credentials',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: UpdateTicketCredsForm })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.UpdateTicketHolderCredentials)
  @Put('updateCreds')
  async updateTicketHolderCredsById(
    @CurrentUser() user: User,
    @Body() body: UpdateTicketCredsForm
  ) {
    const form = UpdateTicketCredsForm.from(body);
    const errors = await UpdateTicketCredsForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);

    const updatedTicket = await this.ticketService.updateTicketHolderCredsById(
      user,
      body
    );
    if (!updatedTicket)
      throw new ApiException(ErrorCodes.UpdateTicketCredsError);
    return TicketDto.toEntity(updatedTicket);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully update ticket status',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: UpdateTicketStatusForm })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.UpdateTicketStatus)
  @Put('updateStatus')
  async updateTicketStatusById(@Body() body: UpdateTicketStatusForm) {
    const form = UpdateTicketStatusForm.from(body);
    const errors = await UpdateTicketStatusForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);

    const updatedTicket = await this.ticketService.updateTicketStatusById(body);
    if (!updatedTicket)
      throw new ApiException(ErrorCodes.UpdateTicketStatusError);
    return TicketDto.toEntity(updatedTicket);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully created a new ticket',
    type: CreateTicketForm,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateTicketForm })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.CreateNewTicket)
  @Post()
  async createTicket(
    @CurrentUser() user: User,
    @Body() body: CreateTicketForm
  ) {
    const form = CreateTicketForm.from(body);
    const errors = await CreateTicketForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    const picked_flight = await this.ticketService.getRelevantFlightById(form);
    if (!picked_flight) {
      throw new ApiException(ErrorCodes.NoAvaliableSeats);
    }

    const ticket = await this.ticketService.createTicket(form, user);
    if (!ticket) throw new ApiException(ErrorCodes.CreateTicketError);
    return TicketDto.toEntity(ticket);
  }
}
