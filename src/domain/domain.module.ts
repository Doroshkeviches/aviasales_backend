import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service';
import { PrismaModule } from '../libs/prisma/src/prisma.module';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';
import { CityReposService } from './repos/city-repos.service';
import { OrdersRepoService } from './repos/orders-repos.service';


@Module({
  imports: [PrismaModule],
  providers: [UsersRepoService, RolesReposService, CityReposService,DeviceRepoService,OrdersRepoService],
  exports: [UsersRepoService, RolesReposService, CityReposService,DeviceRepoService,OrdersRepoService],
})
export class DomainModule {}
