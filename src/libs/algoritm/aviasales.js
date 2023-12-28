import { convertToGraph } from "./utils/convert-to-graph"

export function findAllPath(graph, start, end) {
    const queue = [[{ [start]: { end_date: 0 } }]]
    const path = []
    const maxLength = 3 // Максимальное количество городов? в одном пути (n-1 = количество полетов) (n-2 количество пересадок)

    while (queue.length > 0) {
        const currentPath = queue.shift()
        if (currentPath.length > maxLength) { // если полетов больше чем максимум => удаляем путь
            continue
        }
        const currentPathKeys = currentPath.reduce((container, obj) => [...container, ...Object.keys(obj)], []);
        const currentNode = Object.keys(currentPath.at(-1))[0]
        const currentNodeNode = currentPath.at(-1)[currentNode]

        if (currentNode === end) {
            path.push(currentPath)
        } else {
            for (const neighbor in graph[currentNode]) {
                console.log(currentNodeNode)
                const prev_fluing_time = currentNodeNode.end_date //change to real end_date
                const next_fluing_time = graph[currentNode][neighbor].start_date
                console.log(prev_fluing_time, next_fluing_time, 'before')
                if (!currentPathKeys.includes(neighbor) && prev_fluing_time <= next_fluing_time) {
                    console.log(prev_fluing_time, next_fluing_time, 'after')

                    queue.push([...currentPath, { [neighbor]: graph[currentNode][neighbor], }])
                }
            }
        }

    }
    return path
}
const arr_of_flights = [{
    from_city: "A",
    to_city: "B",
    start_date: 1,
    end_date: 3,
    price: 10
},
{
    from_city: "A",
    to_city: "C",
    start_date: 2,
    end_date: 4,
    price: 15
},
{
    from_city: "B",
    to_city: "C",
    start_date: 3,
    end_date: 4,
    price: 20
},
{
    from_city: "B",
    to_city: "D",
    start_date: 3,
    end_date: 5,
    price: 25
}
]
const convertedGraph = convertToGraph(arr_of_flights)
const res = findAllPath(convertedGraph, "A", "D")
console.log(res[0])