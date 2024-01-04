import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { ChangeFlightStatus } from './domain/ChangeFlightStatusForm';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import { ChangeFlightPrice } from './domain/ChangeFlightPriceForm';
import { ApiException } from '@/src/libs/exceptions/api-exception';
import { RequirePermissions } from '@/src/libs/security/decorators/permission.decorator';
import { JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
import { UserPermissions } from '@prisma/client';
import { PathsDto } from './domain/paths.dto';

@Controller('flights')
export class FlightsController {
  constructor(private flightService: FlightsService) {}

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.GetArrayOfPath)
  @Get()
  async getArrayOfPath(
    @Query('from_city') from_city: string,
    @Query('to_city') to_city: string,
    @Query('date') date_string: string
  ) {
    const start_flight_date = new Date(date_string);
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
      { start_flight_date }
    );
    if (!path.length) {
      throw new ApiException(ErrorCodes.NoPath);
    }
    const sortedPathByPrice = this.flightService.sortArraysByTotalPrice(path);
    // const sortedPathByTime = this.flightService.sortArraysByTotalTime(path);
    return PathsDto.toEntities(sortedPathByPrice);
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.ChangeFlightStatus)
  @Post('status')
  async changeFlightStatus(@Body() body: ChangeFlightStatus) {
    const form = ChangeFlightStatus.from(body);
    const errors = ChangeFlightStatus.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    return this.flightService.changeFlightStatus(form);
  }

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
