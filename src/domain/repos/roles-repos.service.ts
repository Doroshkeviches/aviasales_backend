import { Injectable } from '@nestjs/common';
import { Role, UserRoles } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@/src/libs/prisma/src';

@Injectable()
export class RolesReposService {
    constructor(private prisma: PrismaService) { }
    async getRole(type: UserRoles) {
        const role = this.prisma.role.findFirst({ where: { type } })
        return role
    }
    async createRole(type: UserRoles) {
        return this.prisma.role.create({
            data: {
                type
            }
        })
    }
    async getRoleById(id: Pick<Role, 'id'>) {
        return this.prisma.role.findUnique({ where: { id: id.id } })
    }
}