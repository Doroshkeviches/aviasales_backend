import { UsersRepoService } from '@/src/domain/repos/user-repos.service';
import { user_id } from '@/src/types/user-id.type';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepo: UsersRepoService) {}

  async getAllUsers(page: number) {
    return this.userRepo.getAllUsers(page);
  }
  async updateUser(data: Partial<User>) {
    return this.userRepo.updateUser(data);
  }
  async getOneUserById(id: Pick<User, 'id'>) {
    return this.userRepo.getOneUserById(id);
  }
}
