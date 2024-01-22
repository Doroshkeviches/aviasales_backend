<<<<<<< HEAD
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersRepoService } from "@backend/domain/repos/user-repos.service";
=======
import { UsersReposService } from '@/src/domain/repos/user-repos.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
>>>>>>> 15fc22f05449d6b28ca56875aeb24018c7b91ffd

@Injectable()
export class UserService {
  constructor(private userRepo: UsersReposService) {}

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
