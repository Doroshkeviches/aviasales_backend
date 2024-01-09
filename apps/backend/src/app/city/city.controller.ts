import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CityService } from './city.service';
import { City, UserPermissions } from '@prisma/client';
import { CityForm } from './domain/city.form';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { CityDto } from './domain/city.dto';
import {JwtAuthGuard} from "@app/security/../../../../../libs/security/guards/security.guard";
import {RequirePermissions} from "@app/security/../../../../../libs/security/decorators/permission.decorator";
import {ApiException} from "@app/exceptions/api-exception";
import {ApiRequestException} from "@app/exceptions/api-request-exception";

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get all cities',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetAllCities)
  @Get()
  async getAllCities() {
    const cities = await this.cityService.getAllCities();
    if (!cities) throw new ApiException(ErrorCodes.NoCities);
    return CityDto.toEntities(cities);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get single city',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetCityById)
  @Get(':id')
  async getCityById(@Param('id') city_id: Pick<City, 'id'>) {
    const city = await this.cityService.getCityById(city_id);
    if (!city) throw new ApiException(ErrorCodes.NoCity);
    return CityDto.toEntity(city);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully create new city',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CityForm })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.CreateNewCity)
  @Post()
  async createNewCity(@Body() body: CityForm) {
    const form = CityForm.from(body);
    const errors = await CityForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    const city = await this.cityService.getCityByTitle(form);
    if (city) throw new ApiException(ErrorCodes.ExistedCity);

    const newCity = await this.cityService.createNewCity(body);
    if (!newCity) throw new ApiException(ErrorCodes.CreateCityError);
    return CityDto.toEntity(newCity);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully update city title',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CityForm })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.UpdateCityTitleById)
  @Put(':id')
  async updateCityTitleById(
    @Param('id') city_id: string,
    @Body() body: CityForm
  ) {
    const form = CityForm.from(body);
    const errors = await CityForm.validate(form);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    const city = await this.cityService.getCityByTitle(form);
    if (city) throw new ApiException(ErrorCodes.ExistedCity);

    const updatedCity = await this.cityService.updateCityTitleById(
      city_id,
      body
    );
    if (!updatedCity) throw new ApiException(ErrorCodes.UpdateCityError);
    return CityDto.toEntity(updatedCity);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully delete city',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.DeleteCityById)
  @Delete(':id')
  async deleteCityById(@Param() id: Pick<City, 'id'>) {
    return await this.cityService.deleteCityById(id);
  }
}