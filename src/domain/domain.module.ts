import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service'
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';



@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersRepoService,  RolesReposService],
  exports: [UsersRepoService,  RolesReposService],
})
export class DomainModule { }
