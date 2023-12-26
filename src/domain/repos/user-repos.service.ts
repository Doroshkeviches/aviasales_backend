import { Injectable } from "@nestjs/common";
import { Role, User } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from "@/src/libs/prisma/src";
import { user_id } from "@/src/types/user-id.type";



@Injectable()
export class UsersRepoService {
    constructor(private prisma: PrismaService) { }
    async getAllUsers(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role_type: true,
                orders: true,
            },

            take: pageSize,
            skip,
        })
    }

    async getOneUserByEmail(email: Pick<User, "email">) {
        return this.prisma.user.findUnique({
            where: { ...email },
        })
    }


    async getOneUserById(id: user_id) {
        const user = await this.prisma.user.findUnique({
            where: { id: id.id },
            select: {
                id: true,
                email: true,
                role_type: true,
                orders: true
            },
        })
        return user
    }

    async createUser(dto: Pick<User, 'email' | 'first_name' | 'last_name' | 'password'>, role: Role) {
        const { email, password, first_name, last_name } = dto
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashPassword,
                first_name,
                last_name,
                role_id: role.id,
                role_type: role.type,
            },

        })
        return user
    }

    async updateUserRefreshToken(id: user_id, refresh_token: Pick<User, 'refresh_token'>) {
        const user = await this.prisma.user.update({
            where: { id: id.id },
            data: {
                ...refresh_token
            }
        })
        return user
    }

    async deleteUser(id: user_id) {
        return this.prisma.user.delete({
            where: { ...id }
        })
    }
}