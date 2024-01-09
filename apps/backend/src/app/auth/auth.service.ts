import { Injectable } from '@nestjs/common';
import { RolesReposService } from '@/src/domain/repos/roles-repos.service';
import { UsersRepoService } from '@/src/domain/repos/user-repos.service';
import { SecurityService } from 'apps/libs/security/src';
import * as bcrypt from 'bcryptjs';
import { Device, User, UserRoles } from '@prisma/client';
import { DeviceRepoService } from '@/src/domain/repos/device-repos.service';
import { v4 } from 'uuid';



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
        await this.deviceRepo.updateResetToken({ user_id: user.id, device_id, refresh_token: tokens.refresh_token })
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
                refresh_token: token
            },
        );
        return entity ? token : undefined;
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

    async findSessionByResetToken(data: Pick<User, 'email'> & Pick<Device, 'device_id' | 'refresh_token'>
    ) {
        return await this.deviceRepo.findByResetToken(data);
    }

    async changePassword(user: User, data: Pick<User, 'password'>) {
        const password = await this.securityService.hashPassword(data);
        return await this.usersRepo.changePassword(user, { password });
    }

    async deleteRefreshToken(user: Partial<User>, device_id: Pick<Device, 'device_id'>) {
        return await this.deviceRepo.deleteRefreshToken(user, device_id);
    }
}
