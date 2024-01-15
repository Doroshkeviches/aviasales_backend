import { Injectable } from "@nestjs/common";
import { Device, Role, User, UserRoles } from "@prisma/client";
import { user_id } from "@/src/types/user-id.type";
import { PrismaService } from "@app/prisma";

const includingData = () => {
  return {
    include: {
      devices: true,
      tickets: {
        include: {
          flight: {
            include: {
              plane: true,
              from_city: true,
              to_city: true,
            },
          },
        },
      },
    },
  } as const;
};

@Injectable()
export class UsersReposService {
  constructor(private prisma: PrismaService) { }
  async getAllUsers(page: number, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    return this.prisma.user.findMany({
      take: pageSize,
      skip,
      ...includingData(),
    });
  }

  async getUsersBySearchQuery(searchQuery: string) {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: searchQuery,
            },
          },
          {
            last_name: {
              contains: searchQuery,
            },
          },
        ],
      },
      ...includingData(),
    });
  }

  async getUserByEmail({ email }: Pick<User, "email">) {
    return await this.prisma.user.findUnique({
      where: { email },
      ...includingData(),
    });
  }


  async getOneUserById({ id }: Pick<User, "id">) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      ...includingData(),
    });
    return user;
  }



  async createUser(
    dto: Pick<User, "email" | "first_name" | "last_name">,
    role: Role,
    { password }: Pick<User, "password">,
  ) {
    const { email, first_name, last_name } = dto;
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        first_name,
        last_name,
        role_id: role.id,
        role_type: role.type,
      },
      include: {
        role: true,
      },
    });
    return user;
  }

  async deleteUser({ id }: user_id) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async changePassword(user: User, data: Partial<User>) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { password: data.password },
      include: {
        role: true,
      },
    });
  }

  async getAdminByEmail({ email }: Pick<User, "email">) {
    return this.prisma.user.findUnique({
      where: {
        email,
        role_type: {
          in: [UserRoles.Admin, UserRoles.Manager],
        },
      },
      include: {
        role: true,
      },
    });
  }

  async updateUser(user: Partial<User>) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        first_name: user.first_name,
        email: user.email,
        last_name: user.last_name,
      },
      ...includingData(),
    });
  }
}
