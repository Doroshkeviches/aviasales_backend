import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Device, User, UserRoles } from '@prisma/client';
import { v4 } from 'uuid';
import {SecurityService} from "@app/security";
import {UsersRepoService} from "@backend/domain/repos/user-repos.service";
import {DeviceRepoService} from "@backend/domain/repos/device-repos.service";
import {RolesReposService} from "@backend/domain/repos/roles-repos.service";



@Injectable()
export class AuthService {
    constructor(
        private usersRepo: UsersRepoService,
        private deviceRepo: DeviceRepoService,
        private rolesRepo: RolesReposService,
        private securityService: SecurityService,
    ) { }

    async updateTokens(user: User, { device_id }: Pick<Device, 'device_id'>) {
        const tokens = await this.securityService.generateTokens(user)
        return tokens;
    }
    async getUserByEmail(email: Pick<User, 'email'>) {
        const user = await this.usersRepo.getUserByEmail(email);
        return user
    }

    async getAdminByEmail(email: Pick<User, 'email'>) {
        return this.usersRepo.getAdminByEmail(email)
    }

    async comparePassword(user: User, password: Pick<User, 'password'>) {
        const isCompare = await bcrypt.compare(password.password, user.password)
        return isCompare

    }

    async findSessionByEmailAndDeviceId(data: Pick<User, 'email'> & Pick<Device, 'device_id'>) {
        return await this.deviceRepo.findSessionByEmailAndDeviceId(data);
    }


    async setResetToken(session: Device & { user: User }) {
        const token = v4();
        const entity = await this.deviceRepo.updateResetToken(
            {
                user_id: session.user.id,
                device_id: session.device_id,
                reset_token: token
            },
        );
        return token
    }


    async signUp(data: Pick<User, 'email' | 'password' | 'first_name' | 'last_name'> & Pick<Device, 'device_id'>) {
        const role = await this.rolesRepo.getRole(UserRoles.Client)
        const password = await this.securityService.hashPassword(data)
        const user = await this.usersRepo.createUser(data, role, { password })
        await this.deviceRepo.updateSession(user, data)
        return user
    }

    async signout(user: User, device_id: Pick<Device, 'device_id'>) {
        return await this.deviceRepo.deleteRecord(user, device_id)
    }

    async authenticate(user: User, device_id: Pick<Device, 'device_id'>) {
        const tokens = await this.securityService.generateTokens(user)
        await this.deviceRepo.updateSession(user, device_id);
        return tokens;
    }

    async findSessionByResetToken(data: Pick<User, 'email'> & Pick<Device, 'device_id' | 'reset_token'>
    ) {
        return await this.deviceRepo.findByResetToken(data);
    }

    async changePassword(user: User, data: Pick<User, 'password'>) {
        const password = await this.securityService.hashPassword(data);
        return await this.usersRepo.changePassword(user, { password });
    }

    async deleteResetToken(user: Partial<User>, device_id: Pick<Device, 'device_id'>) {
        return await this.deviceRepo.deleteResetToken(user, device_id);
    }
}
