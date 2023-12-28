export default function convertToGraph(arr) {
    const graph = {};

    arr.forEach(({ from_city, to_city, start_date, end_date, price }) => {
        // Create nodes in the graph if not already present
        if (!graph[from_city]) {
            graph[from_city] = {};
        }
        if (!graph[to_city]) {
            graph[to_city] = {};
        }

        // Add edges with weights to represent start_date, end_date, or price
        graph[from_city][to_city] = { start_date, end_date, price };
    });

    return graph;
}