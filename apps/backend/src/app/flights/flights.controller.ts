import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { ChangeFlightStatus } from './domain/ChangeFlightStatus.form';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ChangeFlightPrice } from './domain/ChangeFlightPrice.form';
import { UserPermissions } from '@prisma/client';
import { PathsDto } from './domain/paths.dto';
import { ApiResponse } from '@nestjs/swagger';
import {ApiException} from "@app/exceptions/api-exception";
import {ApiRequestException} from "@app/exceptions/api-request-exception";
import {JwtAuthGuard} from "../../../../../libs/security/guards/security.guard";
import {RequirePermissions} from "../../../../../libs/security/decorators/permission.decorator";

@Controller('flights')
export class FlightsController {
  constructor(private flightService: FlightsService) {}

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get array of paths',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetArrayOfPath)
  @Get()
  async getArrayOfPath(
    @Query('from_city') from_city: string,
    @Query('to_city') to_city: string,
    @Query('date') date_string: string,
    @Query('isReturn') isReturn: boolean,
    @Query('returnDate') returnDate: string 

  ) {
    const start_flight_date = new Date(date_string);
    const return_flight_date = new Date(returnDate)
    const from_city_entity = await this.flightService.getCityByTitle({
      title: from_city,
    });
    const to_city_entity = await this.flightService.getCityByTitle({
      title: to_city,
    });
    if (!from_city_entity || !to_city_entity) {
      throw new ApiException(ErrorCodes.NoCity);
    }
    const flights = await this.flightService.getAllFlights({
      start_flight_date,
      from_city_id: from_city_entity.id,
    });
    if (!flights) {
      throw new ApiException(ErrorCodes.NoFlights);
    }
    const graph = await this.flightService.convertToGraph(flights);
    const path = await this.flightService.findAllPaths(
      graph,
      from_city_entity,
      to_city_entity,
      { start_flight_date },
      isReturn,
      { start_flight_date: return_flight_date },
    );
   
    if (!path.length) {
      throw new ApiException(ErrorCodes.NoPath);
    }

    const sortedPathByPrice = this.flightService.sortArraysByTotalPrice(path);
    // const sortedPathByTime = this.flightService.sortArraysByTotalTime(path);
    return PathsDto.toEntities(sortedPathByPrice);
    return sortedPathByPrice
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully change flight status',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.ChangeFlightStatus)
  @Post('status')
  async changeFlightStatus(@Body() body: ChangeFlightStatus) {
    const form = ChangeFlightStatus.from(body);
    const errors = ChangeFlightStatus.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    return this.flightService.changeFlightStatus(form);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully change flight price',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.ChangeFlightPrice)
  @Post('price')
  async changeFlightPrice(@Body() body: ChangeFlightPrice) {
    const form = ChangeFlightPrice.from(body);
    const errors = ChangeFlightPrice.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    return this.flightService.changeFlightPrice(form);
  }
}
