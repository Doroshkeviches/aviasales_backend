import { DeviceReposService } from '@/src/domain/repos/device-repos.service';
import { Injectable } from '@nestjs/common';
import { Device, User } from '@prisma/client';

@Injectable()
export class DevicesService {
    constructor(private devicesRepos: DeviceReposService) { }
    async signoutOneSession(user: User, device_id: Pick<Device, 'device_id'>) {
        return await this.devicesRepos.signoutOneSession(user, device_id)
    }
    async signoutSessions(user: User, device_id: Pick<Device, 'device_id'>) {
        return await this.devicesRepos.signoutSessions(user, device_id)
    }
    async getUserDevices(user: User) {
        return await this.devicesRepos.getUserDevices(user)
    }
}
