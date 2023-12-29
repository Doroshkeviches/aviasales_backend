import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { City } from '@prisma/client';
import { ChangeFlightStatus } from './domain/ChangeFlightStatusForm';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import { ChangeFlightPrice } from './domain/ChangeFlightPriceForm';

@Controller('flights')
export class FlightsController {
    constructor(private flightService: FlightsService) { }
    @Post()
    async getArrayOfPath(@Param('from_city') from_city: string, @Param('to_city') to_city: string, @Param('start_flight_date') start_flight_date: string) {
        //get two cities from citiesRepo 
        // return this.flightService.getArrayOfPaths(city1, city2, start_flight_date)
    }

    @Post('status')
    async changeFlightStatus(@Body() body: ChangeFlightStatus) {
        const form = ChangeFlightStatus.from(body)
        const errors = ChangeFlightStatus.validate(form)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        return this.flightService.changeFlightStatus(form)
    }

    @Post('price')
    async changeFlightPrice(@Body() body: ChangeFlightPrice) {
        const form = ChangeFlightPrice.from(body)
        const errors = ChangeFlightPrice.validate(form)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        return this.flightService.changeFlightPrice(form)
    }
}
