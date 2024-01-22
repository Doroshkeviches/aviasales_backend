import { UsersReposService } from '@/src/domain/repos/user-repos.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PaginatedQueryDto } from './domain/paginatedQuery.dto';

@Injectable()
export class UserService {
  constructor(private userRepo: UsersReposService) {}

  async getAllUsers(paginatedQuery: PaginatedQueryDto) {
    return await this.userRepo.getAllUsers(paginatedQuery);
  }
  async updateUser(data: Partial<User>) {
    return this.userRepo.updateUser(data);
  }
  async getOneUserById(id: Pick<User, 'id'>) {
    return this.userRepo.getOneUserById(id);
  }
  async getUsersBySearchQuery(searchQuery: string) {
    return this.userRepo.getUsersBySearchQuery(searchQuery);
  }
}
