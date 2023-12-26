import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SecurityService } from 'src/libs/security/src';
import { SignUpForm } from './domain/SignUpForm'
import { UserPermissions } from '@prisma/client';
import { SignInForm } from './domain/SignInForm';
import { RequirePermissions } from '@/src/libs/security/decorators/permission.decorator';
import { CurrentUser, JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { ApiException } from '@/src/libs/exceptions/api-exception';
import { TokenDto } from './domain/TokenDto';
import { decoded_user } from '@/src/types/decoded-user.type';
import { SignoutDto } from './domain/SignoutDto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private securityService: SecurityService
    ) { }
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Successfully login',
        type: Boolean,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: SignInForm })
    @Post('login')
    async signIn(@Body() body: SignInForm) {
        const form = SignInForm.from(body)
        const errors = await SignInForm.validate(form)
        if (errors) throw new ApiException(ErrorCodes.InvalidForm)

        const user = await this.authService.getUserByEmail({ email: body.email })
        if (!user) throw new ApiException(ErrorCodes.NoUser)
        const isCompare = await this.authService.comparePassword(user, { password: body.password })

        if (!isCompare) throw new ApiException(ErrorCodes.InvalidPassword)
        const tokens = await this.authService.updateTokens(user)

        return TokenDto.toEntity(tokens)
    }

    @HttpCode(200)
    @ApiResponse({
      status: 200,
      description: 'Successfully created a new user',
      type: Boolean,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: SignUpForm })
    @Post('signup')
    async signUp(@Body() body: SignUpForm) {
        const form = SignUpForm.from(body)
        const errors = await SignUpForm.validate(form)
        if (errors) throw new ApiException(ErrorCodes.InvalidForm)
        const candidate = await this.authService.getUserByEmail({ email: form.email })
        if (candidate) {
            throw new ApiException(ErrorCodes.AlreadyRegistered)
        }
        const user = await this.authService.signUp(form)
        if (!user) throw new ApiException(ErrorCodes.CreateUserError)

        const tokens = await this.authService.updateTokens(user)
        return TokenDto.toEntity(tokens)
    }

    @HttpCode(200)
    @ApiResponse({
      status: 200,
      description: 'Successfully signout',
      type: Boolean,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @RequirePermissions(UserPermissions.SignOut)
    @Post('signout')
    async signOut(@CurrentUser() user: decoded_user) {
        const isTokenDelete = await this.authService.signout(user)
        if (!isTokenDelete) {
            throw new ApiException(ErrorCodes.CannotSingout)
        }
        return SignoutDto.toEntity(isTokenDelete)
    }
    @HttpCode(200)
    @ApiResponse({
      status: 200,
      description: 'refresh',
      type: Boolean,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @RequirePermissions(UserPermissions.RefreshToken)
    @Get('refresh')
    async refresh(@CurrentUser() user: decoded_user) {
        const tokens = await this.securityService.refresh(user)
        return TokenDto.toEntity(tokens)

    }
}
