import { Module } from '@nestjs/common';
import { UsersRepoService } from './repos/user-repos.service';
import { PrismaModule } from '@/src/libs/prisma/src';
import { RolesReposService } from './repos/roles-repos.service';
import { DeviceRepoService } from './repos/device-repos.service';
import { CityReposService } from './repos/city-repos.service';
import { FlightsRepoService } from './repos/flights-repos.service';
import { TicketReposService } from './repos/ticket-repos.service';
import {RedisRepository} from "@/src/domain/repos/redis-repos.service";
import {redisClientFactory} from "@/src/app/redis/redis-client.factory";

@Module({
  imports: [PrismaModule],
  providers: [
    UsersRepoService,
    RolesReposService,
    DeviceRepoService,
    CityReposService,
    FlightsRepoService,
    TicketReposService,
    RedisRepository,
      redisClientFactory,
  ],
  exports: [
    UsersRepoService,
    RolesReposService,
    DeviceRepoService,
    CityReposService,
    FlightsRepoService,
    TicketReposService,
      RedisRepository,
      redisClientFactory
  ],
})
export class DomainModule {}
