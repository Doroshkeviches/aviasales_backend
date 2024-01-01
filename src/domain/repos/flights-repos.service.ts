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
    async changeFlightStatus(data: Pick<Flight, 'id' | 'status'>) {
        return this.prisma.flight.update({
            where: { id: data.id },
            data: {
                status: data.status
            }
        })
    }

    async changeFlightPrice(data: Pick<Flight, 'id' | "price">) {
        return this.prisma.flight.update({
            where: { id: data.id },
            data: {
                price: data.price
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
    async getAllFlights(data: Pick<Flight, 'start_flight_date' | 'from_city_id'>) {
        const next_day_date = new Date(data.start_flight_date)
        next_day_date.setDate(next_day_date.getDate() + 1);
        console.log(data.start_flight_date)
        return this.prisma.flight.findMany({
            where: {
                OR: [
                    {
                        start_flight_date: {
                            gte: data.start_flight_date,
                            lte: next_day_date
                        },
                        from_city_id: data.from_city_id
                    },
                    {
                        from_city_id: {
                            not: data.from_city_id
                        },
                        start_flight_date: {
                            gte: data.start_flight_date
                        }
                    }
                ]

            },
            include: {
                plane: true,
            }

        })
    }
    async getFlightById({ id }: Pick<Flight, 'id'>) {
        return this.prisma.flight.findUnique({
            where: { id },
            include: {
                plane: true
            }
        })
    }
    async deleteFlight({ id }: Pick<Flight, 'id'>, seats: Pick<Flight, 'available_seats'>) {
        return this.prisma.flight.delete({
            where: { id },
        })
    }
}