import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesReposService } from 'src/domain/repos/roles-repos.service';
import { UsersRepoService } from 'src/domain/repos/user-repos.service';
import { ConfigService } from '@nestjs/config';
import { Device, Role, User } from '@prisma/client';
import { user_id } from '@/src/types/user-id.type';

@Injectable()
export class SecurityService {
    constructor(private jwtService: JwtService,
        private usersRepos: UsersRepoService,
        private rolesRepos: RolesReposService,
        private config: ConfigService,
    ) { }
    async generateTokens(user: Pick<User, 'id' | 'role_type' | 'email'>) {
        const payload = { email: user.email, id: user.id, role_type: user.role_type };
        const access_token = this.jwtService.sign(payload, { secret: this.config.get('security').secret })
        const refresh_token = this.jwtService.sign(payload, { secret: this.config.get('security').secret })
        return ({ access_token, refresh_token })
    }

    async refresh(user: Pick<User, 'id' | 'role_type' | 'email'>) {
        const tokens = await this.generateTokens(user)
        const updatedUser = await this.usersRepos.updateUserRefreshToken({id: user.id}, {refresh_token: tokens.refresh_token})

        return tokens
    }

    async decodeUserFromToken(token: Pick<Device, 'refresh_token'>) {
        const user = this.jwtService.verify(token.refresh_token)
        return user
    }

    async getUserById(id: user_id) {
        return this.usersRepos.getOneUserById(id)
    }
    async getRoleById(id: Pick<Role, 'id'>) {
        return this.rolesRepos.getRoleById(id)
    }
}
