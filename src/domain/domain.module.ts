import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service'
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';
import { TicketsRepoService } from './repos/tickets-repos.service';



@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersRepoService,  RolesReposService,DeviceRepoService,TicketsRepoService],
  exports: [UsersRepoService,  RolesReposService,DeviceRepoService,TicketsRepoService],
})
export class DomainModule { }
