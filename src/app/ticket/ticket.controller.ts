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
import { TicketDto } from './domain/ticket.dto';
import { CreateTicketForm } from './domain/create-ticket.form';
import { FlightsService } from '../flights/flights.service';
import { ApiException } from '@/src/libs/exceptions/api-exception';

@Controller('ticket')
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private flightService: FlightsService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Successfully get single ticket',
  })
  @Get(':id')
  @HttpCode(200)
  async getTicketById(@Param('id') id: string) {
    const ticket = await this.ticketService.getTicketById({ id });
    return TicketDto.toEntity(ticket);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully delete ticket by id',
  })
  @Delete(':id')
  @HttpCode(200)
  async deleteTicketById(@Param('id') id: string) {
    return await this.ticketService.deleteTicketById({ id });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update ticket holder credentials',
  })
  @Put('updateCreds')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
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
  @Put('updateStatus')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateTicketStatusForm })
  async updateTicketStatusById(@Body() body: UpdateTicketStatusForm) {
    const form = UpdateTicketStatusForm.from(body);
    const errors = await UpdateTicketStatusForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    return await this.ticketService.updateTicketStatusById(body);
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
  @Post()
  async createTicket(
    @CurrentUser() user: User,
    @Body() body: CreateTicketForm
  ) {
    const form = CreateTicketForm.from(body);
    const errors = await CreateTicketForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    const picked_flight = await this.flightService.getRelevantFlightById(form);
    if (!picked_flight) {
      throw new ApiException(ErrorCodes.NoAvaliableSeats);
    }
    const ticket = await this.ticketService.createTicket(form, user);
    return TicketDto.toEntity(ticket);
  }
}
