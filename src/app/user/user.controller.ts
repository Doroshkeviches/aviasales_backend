import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { UpdateUserForm } from './domain/UpdateUserForm';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { RequirePermissions } from '@/src/libs/security/decorators/permission.decorator';
import { UserPermissions } from '@prisma/client';
import { UserDto } from './domain/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'USERS',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetAllUsers)
  @Get()
  async getAllUsers(@Query('page') page: number) {
    return this.userService.getAllUsers(page);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'USERS',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.UpdateUser)
  @Post()
  async updateUser(@Body() body: UpdateUserForm) {
    const form = UpdateUserForm.from(body);
    // console.log(form);
    const errors = await UpdateUserForm.validate(form);
    // console.log(errors);
    if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors);
    const updatedUser = await this.userService.updateUser(form);
    return updatedUser;
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get single user',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetUserById)
  @Get(':id')
  async getOneUserById(@Param('id') id: string) {
    const user = await this.userService.getOneUserById({ id });
    return UserDto.toEntity(user);
  }

  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully get user by search query',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetUsersBySearchQuery)
  @Get('search')
  async getUsersBySearchQuery(@Query('q') searchQuery: string) {
    const users = await this.userService.getUsersBySearchQuery(searchQuery);
    return UserDto.toEntities(users);
  }
}
