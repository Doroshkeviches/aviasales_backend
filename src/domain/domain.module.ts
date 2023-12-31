import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service';
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';
import { TicketsRepoService } from './repos/tickets-repos.service';
import { CityReposService } from './repos/city-repos.service';




@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersRepoService,  RolesReposService,DeviceRepoService,CityReposService,TicketsRepoService],
  exports: [UsersRepoService,  RolesReposService,DeviceRepoService,CityReposService,TicketsRepoService],
})
export class DomainModule {}
