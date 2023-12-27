import { Injectable } from '@nestjs/common';
//======ALGORITM==========

@Injectable()
export class PathService {

    findAllPath(graph, start: string, end: string) { 
        const queue = [[{ [start]: { end_date: 0 } }]]
        const path = []
        const maxLength = 3 // Максимальное количество городов? в одном пути (n-1 = количество полетов) (n-2 количество пересадок)

        while (queue.length > 0) {
            const currentPath = queue.shift()
            if (currentPath.length > maxLength) { // если полетов больше чем максимум => удаляем путь
                continue
            }
            const currentPathKeys = currentPath.reduce((container: any[], obj) => [...container, ...Object.keys(obj)], []);
            const currentNode = Object.keys(currentPath.at(-1))[0]
            const currentNodeNode = currentPath.at(-1)[currentNode]

            if (currentNode === end) {
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
}
