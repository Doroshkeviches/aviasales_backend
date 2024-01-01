import { CityReposService } from '@/src/domain/repos/city-repos.service';
import { FlightsRepoService } from '@/src/domain/repos/flights-repos.service';
import { Injectable } from '@nestjs/common';
import { City, Flight } from '@prisma/client';

@Injectable()
export class FlightsService {
    constructor(private flightRepo: FlightsRepoService,
        private cityRepo: CityReposService) { }
    async convertToGraph(arr: Flight[]) {
        const graph = {};
        arr.forEach((flight: Flight) => {
            // Create nodes in the graph if not already present
            if (!graph[flight.from_city_id]) {
                graph[flight.from_city_id] = {};
            }
            if (!graph[flight.to_city_id]) {
                graph[flight.to_city_id] = {};
            }

            // Add edges with weights to represent start_date, end_date, or price
            graph[flight.from_city_id][flight.to_city_id] = { ...flight };
        });

        return graph;
    }
    async getAllFlights(data: Pick<Flight, 'start_flight_date' | 'from_city_id'>) {
        return this.flightRepo.getAllFlights(data)
    }
    async findAllPaths(graph, start: City, end: City, maximum_number_of_transfers: number = 5) {
        const queue = [[{ [start.id]: { end_flight_date: 0 } }]]
        const path = []
        // const maximum_number_of_transfers = 30 // Максимальное количество городов? в одном пути (n-1 = количество полетов) (n-2 количество пересадок)

        while (queue.length > 0) {
            const currentPath = queue.shift()
            if (currentPath.length > maximum_number_of_transfers) { // если полетов больше чем максимум => удаляем путь
                continue
            }
            const currentPathKeys = currentPath.reduce((container, obj) => [...container, ...Object.keys(obj)], []);
            const current_node_id = Object.keys(currentPath.at(-1))[0] // получаю айди последнего элемента в нынешнем пути
            const currentNode = currentPath.at(-1)[current_node_id] // получаю данные последнего полета по айди

            if (current_node_id === end.id) { //если попали в конечный город , то сохраняем путь 
                const transformedPath = this.transformPathToArrayOfFlights(currentPath)
                path.push(transformedPath)
            } else {
                for (const neighbor in graph[current_node_id]) {
                    const prev_fluing_time = currentNode.end_flight_date
                    const next_fluing_time = graph[current_node_id][neighbor].start_flight_date
                    if (!currentPathKeys.includes(neighbor) && prev_fluing_time <= next_fluing_time) {
                        queue.push([...currentPath, { [neighbor]: graph[current_node_id][neighbor], }])
                    }
                }
            }

        }
        return path
    }
    async changeFlightStatus(data: Pick<Flight, 'id' | 'status'>) {
        return this.flightRepo.changeFlightStatus(data)
    }
    async changeFlightPrice(data: Pick<Flight, 'id' | 'price'>) {
        return this.flightRepo.changeFlightPrice(data)
    }
    async getFlightById(id: Pick<Flight, 'id'>) {
        return this.flightRepo.getFlightById(id)
    }
    async getCityByTitle(title: Pick<City, 'title'>) {
        return this.cityRepo.getCityByTitle(title)
    }
    transformPathToArrayOfFlights(path) {
        path.shift() // delete empty object
        return path.map(path => {
            return Object.values(path)[0]
        })

    }
    sortArraysByTotalPrice(arrays) {
        return arrays.map(subArray => {
            const totalPrice = subArray.reduce((sum, item) => sum + item.price, 0);
            return { subArray, totalPrice };
        })
            .sort((a, b) => a.totalPrice - b.totalPrice)
            .map(entry => entry.subArray);
    }
}