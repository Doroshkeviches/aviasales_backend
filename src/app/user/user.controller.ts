import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOrderForm } from '../orders/domain/CreateOrderForm';
import { UpdateUserForm } from './domain/UpdateUserForm';
import { ApiRequestException } from '@/src/libs/exceptions/api-request-exception';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { RequirePermissions } from '@/src/libs/security/decorators/permission.decorator';
import { UserPermissions } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
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
        return this.userService.getAllUsers(page)
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
        const form = UpdateUserForm.from(body)
        console.log(form)
        const errors = await UpdateUserForm.validate(form)
        console.log(errors)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        const updatedUser = await this.userService.updateUser(form)
        return updatedUser
    }
}
