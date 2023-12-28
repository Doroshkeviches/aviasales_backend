import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service'
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';



@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersRepoService,  RolesReposService,DeviceRepoService],
  exports: [UsersRepoService,  RolesReposService,DeviceRepoService],
})
export class DomainModule { }
