import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service';
import { PrismaModule } from '../../../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';
import { CityReposService } from './repos/city-repos.service';
import { FlightsRepoService } from './repos/flights-repos.service';
import { TicketReposService } from './repos/ticket-repos.service';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersRepoService,
    RolesReposService,
    DeviceRepoService,
    CityReposService,
    FlightsRepoService,
    TicketReposService,
  ],
  exports: [
    UsersRepoService,
    RolesReposService,
    DeviceRepoService,
    CityReposService,
    FlightsRepoService,
    TicketReposService,
  ],
})
export class DomainModule {}
