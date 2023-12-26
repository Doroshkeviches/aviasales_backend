import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesReposService } from 'src/domain/repos/roles-repos.service';
import { UsersRepoService } from 'src/domain/repos/user-repos.service';
import { SecurityService } from 'src/libs/security/src';
import * as bcrypt from 'bcryptjs';
import { User, UserRoles } from '@prisma/client';
import { SignInForm } from './domain/SignInForm'
import { SignUpForm } from './domain/SignUpForm';
import { Exception } from 'handlebars';
import { UserSessionDto } from '@/src/libs/security/src/dtos/UserSessionDto';
import { ApiException } from '@/src/libs/exceptions/api-exception';
import { ErrorCodes } from '@/src/enums/error-codes.enum';
import { decoded_user } from '@/src/types/decoded-user.type';


@Injectable()
export class AuthService {
    constructor(
        private usersRepo: UsersRepoService,
        private rolesRepo: RolesReposService,
        private securityService: SecurityService,
    ) { }

    async updateTokens(user: User) {
        const tokens = await this.securityService.generateTokens(user)
        const updatedUser = await this.usersRepo.updateUserRefreshToken({ id: user.id }, { refresh_token: tokens.refresh_token })
        return tokens;
    }
    async getUserByEmail(email: Pick<User, 'email'>) {
        const user = await this.usersRepo.getOneUserByEmail(email);
        return user
    }
    async comparePassword(user: User, password: Pick<User, 'password'>) {
        const isCompare = await bcrypt.compare(password.password, user.password)
        return isCompare

    }
    async signUp(data: Pick<User, 'email' | 'password' | 'first_name' | 'last_name'>) {
        const role = await this.rolesRepo.getRole(UserRoles.Client)
        const user = await this.usersRepo.createUser(data, role)
        return user
    }

    async signout(user: decoded_user) {
        const updatedUser = await this.usersRepo.updateUserRefreshToken({ id: user.id }, { refresh_token: null })
        return { isTokenDelete: !updatedUser.refresh_token }
    }
}
