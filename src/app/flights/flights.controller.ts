import { Controller, Get, Post, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { City } from '@prisma/client';

@Controller('flights')
export class FlightsController {
    constructor(private flightService: FlightsService) { }
    @Get()
    async getArrayOfPath(@Query('start_date') start_flight_date: Date) {
        const flights = await this.flightService.getAllFlights({ start_flight_date })
        console.log(flights, 'flights')
        const graph = await this.flightService.convertToGraph(flights)
        console.log(graph, 'graph')
        const start = {
            id: '86d6bbf0-e68a-4ab6-8216-fbf900c4b2c5',
            title: 'Minsk'
        }
        const end = {
            id: 'ae94164f-2a89-4b8c-9d93-8d4d8c49a2ee',
            title: "Msk"
        }
    }
    @Post()
    async createFlight(body: any) {
        const start = {
            id: '86d6bbf0-e68a-4ab6-8216-fbf900c4b2c5',
            title: 'Minsk'
        }
        const end = {
            id: 'ae94164f-2a89-4b8c-9d93-8d4d8c49a2ee',
            title: "Msk"
        }
        const plain = {
            id: 'ae94163f-2a89-4b8c-9d93-8d4d8c49a2ee',
            title: "Msk",
            seats: 40
        }
        return this.flightService.createFlight(start, end, plain, body)
    }
    async generateGraph() {

    }
}
