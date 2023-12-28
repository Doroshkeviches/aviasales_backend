import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesReposService } from 'src/domain/repos/roles-repos.service';
import { UsersRepoService } from 'src/domain/repos/user-repos.service';
import { ConfigService } from '@nestjs/config';
import { Device, Role, User } from '@prisma/client';
import { user_id } from '@/src/types/user-id.type';
import { DeviceRepoService } from '@/src/domain/repos/device-repos.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class SecurityService {
    constructor(private jwtService: JwtService,
        private usersRepos: UsersRepoService,
        private rolesRepos: RolesReposService,
        private deviceRepos: DeviceRepoService,
        private config: ConfigService,
    ) { }
    async generateTokens(user: Pick<User, 'id' | 'role_id' | 'email'>) {
        const payload = { email: user.email, id: user.id, role_id: user.role_id };
        const access_token = this.jwtService.sign(payload, { secret: this.config.get('security').secret })
        const refresh_token = this.jwtService.sign(payload, { secret: this.config.get('security').secret })
        return ({ access_token, refresh_token })
    }

    async refresh(user: User, device_id: Pick<Device, 'device_id'>) {
        const tokens = await this.generateTokens(user)
        await this.deviceRepos.updateSession(user, device_id)

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

    async hashPassword(password: Pick<User, 'password'>) {
        // Method generates hashed password with SHA256
        const salt = 5;
        return await bcrypt.hash(password.password, salt)
    }
}
