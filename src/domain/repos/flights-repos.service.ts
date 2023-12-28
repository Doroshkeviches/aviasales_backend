import { Injectable } from '@nestjs/common';
import { City, Flight, FlightStatus, Plane, Role, UserPermissions, UserRoles } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@/src/libs/prisma/src';

@Injectable()
export class FlightsRepoService {
    constructor(private prisma: PrismaService) { }
    async createFlight(from_city: City, to_city: City, plane: Plane, { price }: Pick<Flight, 'price'>) {
        return this.prisma.flight.create({
            data: {
                from_city_id: from_city.id,
                to_city_id: to_city.id,
                start_flight_date: new Date(),
                end_flight_date: new Date(),
                status: FlightStatus.Planned,
                price,
                available_seats: plane.seats,
                plane_id: plane.id
            }
        })
    }
    async changeFlightStatus({ id }: Pick<Flight, 'id'>, status: Pick<Flight, 'status'>) {
        return this.prisma.flight.update({
            where: { id },
            data: {
                status: status.status
            }
        })
    }

    async changeFlightPrice({ id }: Pick<Flight, 'id'>, price: Pick<Flight, 'price'>) {
        return this.prisma.flight.update({
            where: { id },
            data: {
                price: price.price
            }
        })
    }
    async decrementAvailableSeats({ id }: Pick<Flight, 'id'>, seats: Pick<Flight, 'available_seats'>) {
        return this.prisma.flight.update({
            where: {
                id,
                available_seats: { gte: seats.available_seats }
            },
            data: {
                available_seats: { decrement: seats.available_seats }
            }
        })
    }
    async getAllFlights({ start_flight_date }: Pick<Flight, 'start_flight_date'>) {
        return this.prisma.flight.findMany({
            where: {
                start_flight_date: {
                    gte: start_flight_date
                }
            }
        })
    }
    async deleteFlight({ id }: Pick<Flight, 'id'>, seats: Pick<Flight, 'available_seats'>) {
        return this.prisma.flight.delete({
            where: { id },
        })
    }
}