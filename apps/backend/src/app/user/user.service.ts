import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersRepoService } from "@backend/domain/repos/user-repos.service";

@Injectable()
export class UserService {
  constructor(private userRepo: UsersRepoService) {}

  async getAllUsers(page: number) {
    return await this.userRepo.getAllUsers(page);
  }
  async updateUser(data: Partial<User>) {
    return this.userRepo.updateUser(data);
  }
  async getOneUserById(id: Pick<User, "id">) {
    return this.userRepo.getOneUserById(id);
  }
  async getUsersBySearchQuery(searchQuery: string) {
    return this.userRepo.getUsersBySearchQuery(searchQuery);
  }
}
