import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { CityService } from "./city.service";
import { City } from "@prisma/client";
import { CityForm } from "./domain/city.form";

@Controller("city")
export class CityController {
  constructor(private cityService: CityService) {}

  @ApiResponse({
    status: 200,
    description: "Successfully get all cities",
  })
  @Get("all")
  @HttpCode(200)
  async getAllCities() {
    return await this.cityService.getAllCities();
  }

  @ApiResponse({
    status: 200,
    description: "Successfully get single city",
  })
  @Get(":id")
  @HttpCode(200)
  async getCityById(@Param("id") city_id: Pick<City, "id">) {
    return await this.cityService.getCityById(city_id);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully create new city",
  })
  @Post("new")
  @HttpCode(200)
  async createNewCity(@Body() newCity: CityForm) {
    return await this.cityService.createNewCity(newCity);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully update city title",
  })
  @Put(":id")
  @HttpCode(200)
  async updateCityTitleById(
    @Param("id") city_id: Pick<City, "id">,
    @Body() newTitle: CityForm
  ) {
    return await this.cityService.updateCityTitleById(city_id, newTitle);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully delete city",
  })
  @Delete(":id")
  @HttpCode(200)
  async deleteCityById(@Param() id: Pick<City, "id">) {
    return await this.cityService.deleteCityById(id);
  }
}
