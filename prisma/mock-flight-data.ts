import { Flight, FlightStatus, City, Plane } from "@prisma/client";

function getRandom(arr: any[]) {
  const index = Math.floor(Math.random() * arr.length);
  return index;
}

export async function mock(cities: City[], planes: Plane[]) {
  const mockFlights: Omit<Flight, "id">[] = [];
  const start = new Date("2023-12-29T12:00:00");
  const end = new Date("2023-12-29T15:00:00");

  for (let i = 1; i < cities.length; i++) {
    if (!start && !end) {
      continue;
    }
    const indexPlane = getRandom(planes);
    let mockFlight: Omit<Flight, "id"> = {
      start_flight_date: start,
      end_flight_date: end,
      from_city_id: cities[i].id,
      to_city_id: cities[i - 1].id,
      status: FlightStatus.Planned,
      price: 100,
      plane_id: planes[indexPlane].id,
      available_seats: planes[indexPlane].seats,
    };
    mockFlights.push(mockFlight);
  }
  // console.log(mockFlights);
  return mockFlights;
}
