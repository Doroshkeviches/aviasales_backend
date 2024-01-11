import { Injectable } from '@nestjs/common';
import { Device, Role, User, UserRoles } from '@prisma/client';
import { PrismaService } from '@/src/libs/prisma/src';

@Injectable()
export class DeviceRepoService {
    constructor(private prisma: PrismaService) { }
    async updateSession(user: User, { device_id }: Pick<Device, 'device_id'>) {
        return this.prisma.device.upsert({
            where: {
                user_id_device_id: {
                    user_id: user.id,
                    device_id,
                },
            },
            create: {
                user_id: user.id,
                device_id,
            },
            update: {
                user_id: user.id,
                device_id,
            },
        });
    }

    async findSessionByEmailAndDeviceId(data: Pick<User, 'email'> & Pick<Device, 'device_id'>) {
        return this.prisma.device.findFirst({
            where: {
                device_id: data.device_id,
                user: { email: data.email, role_type: UserRoles.Client },
            },
            include: { user: true },
        });
    }

    async deleteRecord(user: User, { device_id }: Pick<Device, 'device_id'>) {
        return this.prisma.device.delete({
            where: { user_id_device_id: { user_id: user.id, device_id, } },
        });
    }

    async findByResetToken(data: Pick<User, 'email'> & Pick<Device, 'device_id' | 'reset_token'>) {
        return await this.prisma.device.findUnique({
            where: {
                device_id_reset_token: {
                    device_id: data.device_id,
                    reset_token: data.reset_token,
                },
                user: {
                    email: data.email,
                },
            },
            include: { user: true },
        });
    }

    async updateResetToken(
        data: Pick<Device, 'user_id'> & Pick<Device, 'device_id' | 'reset_token'>
    ) {
        return this.prisma.device.upsert({
            where: {
                user_id_device_id: {
                    user_id: data.user_id,
                    device_id: data.device_id,
                },
            },
            create: {
                reset_token: data.reset_token,
                user_id: data.user_id,
                device_id: data.device_id
            },
            update: {
                reset_token: data.reset_token,
                user_id: data.user_id,
                device_id: data.device_id
            },
        });
    }

    async deleteResetToken(user: Partial<User>, { device_id }: Pick<Device, 'device_id'>) {
        return this.prisma.device.update({
            where: {
                user_id_device_id: {
                    user_id: user.id,
                    device_id,
                },
            },
            data: {
                reset_token: null,
            },
        });
    }
    async getRoleById({ id }: Pick<Role, 'id'>) {
        return this.prisma.role.findUnique({ where: { id } })
    }
}