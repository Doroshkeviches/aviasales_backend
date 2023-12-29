import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service';
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';
<<<<<<< HEAD
import { FlightsRepoService } from './repos/flights-repos.service';



@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersRepoService, RolesReposService, DeviceRepoService, FlightsRepoService],
  exports: [UsersRepoService, RolesReposService, DeviceRepoService, FlightsRepoService],
=======
import { CityReposService } from './repos/city-repos.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepoService, RolesReposService, CityReposService,DeviceRepoService],
  exports: [UsersRepoService, RolesReposService, CityReposService,DeviceRepoService],
>>>>>>> ff081d9b6ac9cb6543b0e79d4eaff886eb7317c3
})
export class DomainModule {}
