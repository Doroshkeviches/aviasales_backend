import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiException } from '@app/exceptions/api-exception';
import { ApiRequestException } from '@app/exceptions/api-request-exception';
import { ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard, CurrentUser } from 'libs/security/guards/security.guard';
import { SignoutForm } from '../auth/domain/Signout.form';

@Controller('devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) { }
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: "signout-selected-session",
        type: SignoutForm,
    })
    @ApiResponse({ status: 400, description: "Bad request" })
    @UseGuards(JwtAuthGuard)
    // @RequirePermissions(UserPermissions.RefreshToken)
    @Post("signout-selected-session")
    async signOutOneSession(@CurrentUser() user: User, @Body() body: SignoutForm) {
        const form = SignoutForm.from(body)
        const errors = await SignoutForm.validate(form)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        const res = await this.devicesService.signoutOneSession(user, body)
        console.log('res')
        console.log(res)
        return res
    }

    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: "signout-sessions",
        type: SignoutForm,
    })
    @ApiResponse({ status: 400, description: "Bad request" })
    @UseGuards(JwtAuthGuard)
    // @RequirePermissions(UserPermissions.RefreshToken)
    @Post("signout-sessions")
    async signOutSessions(@CurrentUser() user: User, @Body() body: SignoutForm) {
        const form = SignoutForm.from(body)
        const errors = await SignoutForm.validate(form)
        if (errors) throw new ApiRequestException(ErrorCodes.InvalidForm, errors)
        const res = await this.devicesService.signoutSessions(user, body)
        console.log('res')
        console.log(res)
        return res
    }


    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: "signout-sessions",
        type: SignoutForm,
    })
    @ApiResponse({ status: 400, description: "Bad request" })
    @UseGuards(JwtAuthGuard)
    // @RequirePermissions(UserPermissions.RefreshToken)
    @Get(":id")
    async getDevicesByUserId(@Param('id') id: string) {
        const devices = await this.devicesService.getDevicesByUserId({ id })
        console.log(devices)
        return devices
    }
}
