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
import { ApiException } from '@/src/libs/exceptions/api-exception';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import { CityDto } from './domain/city.dto';
import { RequirePermissions } from '@/src/libs/security/decorators/permission.decorator';
import { JwtAuthGuard } from '@/src/libs/security/guards/security.guard';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) { }

  @ApiResponse({
    status: 200,
    description: 'Successfully get all cities',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetAllCities)
  @Get()
  async getAllCities() {
    const cities = await this.cityService.getAllCities();
    return CityDto.toEntities(cities);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully get single city',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetCityById)
  @Get(':id')
  async getCityById(@Param('id') city_id: Pick<City, 'id'>) {
    const city = await this.cityService.getCityById(city_id);
    return CityDto.toEntity(city);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully create new city',
  })
  @HttpCode(200)
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

    return await this.cityService.createNewCity(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully update city title',
  })
  @HttpCode(200)
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

    return await this.cityService.updateCityTitleById(city_id, body);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully delete city',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.DeleteCityById)
  @Delete(':id')
  async deleteCityById(@Param() id: Pick<City, 'id'>) {
    return await this.cityService.deleteCityById(id);
  }
}
