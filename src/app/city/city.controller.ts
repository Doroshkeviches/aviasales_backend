import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CityService } from './city.service';
import { City } from '@prisma/client';
import { CityForm } from './domain/city.form';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiException } from '@/src/libs/exceptions/api-exception';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfully get all cities',
  })
  @Get()
  @HttpCode(200)
  async getAllCities() {
    return await this.cityService.getAllCities();
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully get single city',
  })
  @Get(':id')
  @HttpCode(200)
  async getCityById(@Param('id') city_id: Pick<City, 'id'>) {
    return await this.cityService.getCityById(city_id);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully create new city',
  })
  @Post()
  @HttpCode(200)
  @ApiBody({ type: CityForm })
  async createNewCity(@Body() body: CityForm) {
    const form = CityForm.from(body);
    const errors = await CityForm.validate(form);
    if (errors) throw new ApiException(ErrorCodes.InvalidForm);
    const city = await this.cityService.getCityByTitle({ title: form.title });
    // if (city) throw new ApiException(ErrorCodes.ExistedCity);

    return await this.cityService.createNewCity(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update city title',
  })
  @Put(':id')
  @HttpCode(200)
  @ApiBody({ type: CityForm })
  async updateCityTitleById(
    @Param('id') city_id: Pick<City, 'id'>,
    @Body() body: CityForm
  ) {
    const form = CityForm.from(body);
    const errors = await CityForm.validate(form);
    if (errors) throw new ApiException(ErrorCodes.InvalidForm);
    const city = await this.cityService.getCityByTitle({ title: form.title });
    // if (city) throw new ApiException(ErrorCodes.ExistedCity);

    return await this.cityService.updateCityTitleById(city_id, body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully delete city',
  })
  @Delete(':id')
  @HttpCode(200)
  async deleteCityById(@Param() id: Pick<City, 'id'>) {
    return await this.cityService.deleteCityById(id);
  }
}
