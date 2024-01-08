import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import {RedisRepository} from "@/src/domain/repos/redis-repos.service";
import {redisClientFactory} from "@/src/app/redis/redis-client.factory";

@Module({
  providers: [RedisService, RedisRepository, redisClientFactory],
  exports: [RedisService]
})
export class RedisModule {}
