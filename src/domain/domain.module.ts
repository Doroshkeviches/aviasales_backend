import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service';
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { CityReposService } from './repos/city-repos.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepoService, RolesReposService, CityReposService],
  exports: [UsersRepoService, RolesReposService, CityReposService],
})
export class DomainModule {}
