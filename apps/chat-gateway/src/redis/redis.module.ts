import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisRepository } from "../domain/repos/redis-repos.service";
import { redisClientFactory } from "./redis-client.factory";

@Module({
  imports: [],
  providers: [RedisService, RedisRepository, redisClientFactory],
  exports: [RedisService],
})
export class RedisModule { }
