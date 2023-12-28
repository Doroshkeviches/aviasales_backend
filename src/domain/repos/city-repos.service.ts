import { Injectable } from "@nestjs/common";
import { City } from "@prisma/client";
import { PrismaService } from "@/src/libs/prisma/src";

@Injectable()
export class CityReposService {
  constructor(private prisma: PrismaService) {}

  async getAllCities() {
    return await this.prisma.city.findMany();
  }

  async getCityById(id: Pick<City, "id">) {
    return await this.prisma.city.findUnique({
      where: {
        id: id.id,
      },
      include: {
        flights_from_city: true,
        flights_to_city: true,
      },
    });
  }

  async deleteCityById(id: Pick<City, "id">) {
    return await this.prisma.city.delete({
      where: { id: id.id },
    });
  }

  async updateCityTitleById(
    id: Pick<City, "id">,
    newTitle: Pick<City, "title">
  ) {
    const city = await this.prisma.city.update({
      where: { id: id.id },
      data: { ...newTitle },
    });
    return city;
  }

  async createNewCity(data: Pick<City, "title">) {
    const { title } = data;
    const newCity = await this.prisma.city.create({
      data: { title },
    });
    return newCity;
  }
}
