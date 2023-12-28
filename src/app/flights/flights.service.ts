import { FlightsRepoService } from '@/src/domain/repos/flights-repos.service';
import { Injectable } from '@nestjs/common';
import { City, Flight } from '@prisma/client';

@Injectable()
export class FlightsService {
    constructor(private flightRepo: FlightsRepoService) { }
    async createArrayOfPaths(graph, start: City, end: City, date: number) {
        const queue = [[{ [start.id]: { end_date: date } }]]
        const path = []
        const maximum_number_of_transfers = 3 // Максимальное количество городов? в одном пути (n-1 = количество полетов) (n-2 количество пересадок)

        while (queue.length > 0) {
            const currentPath = queue.shift()
            if (currentPath.length > maximum_number_of_transfers) { // если полетов больше чем максимум => удаляем путь
                continue
            }
            const currentPathKeys = currentPath.reduce((container, obj) => [...container, ...Object.keys(obj)], []);
            const currentNode = Object.keys(currentPath.at(-1))[0]
            const currentNodeNode = currentPath.at(-1)[currentNode]

            if (currentNode === end.id) {
                path.push(currentPath)
            } else {
                for (const neighbor in graph[currentNode]) {
                    const prev_fluing_time = currentNodeNode.end_date //change to real end_date
                    const next_fluing_time = graph[currentNode][neighbor].start_date
                    if (!currentPathKeys.includes(neighbor) && prev_fluing_time <= next_fluing_time) {
                        queue.push([...currentPath, { [neighbor]: graph[currentNode][neighbor], }])
                    }
                }
            }

        }
        return path
    }
    async convertToGraph(arr: Flight[]) {
        const graph = {};

        arr.forEach(({ from_city_id, to_city_id, start_flight_date, end_flight_date, price }) => {
            // Create nodes in the graph if not already present
            if (!graph[from_city_id]) {
                graph[from_city_id] = {};
            }
            if (!graph[to_city_id]) {
                graph[to_city_id] = {};
            }

            // Add edges with weights to represent start_date, end_date, or price
            graph[from_city_id][to_city_id] = { start_flight_date, end_flight_date, price };
        });

        return graph;
    }
    async getAllFlights(start_flight_date: Pick<Flight, 'start_flight_date'>) {
        return this.flightRepo.getAllFlights(start_flight_date)
    }
    async createFlight(start, end, plane, price: any) {
        return this.flightRepo.createFlight(start, end, plane, price)
    }
}
