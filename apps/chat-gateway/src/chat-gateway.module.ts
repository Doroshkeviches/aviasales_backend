import { Module } from "@nestjs/common";
import { ChatController } from "./chat-gateway.controller";
import { ChatGatewayService } from "./chat-gateway.service";
import { RedisModule } from "./redis/redis.module";
import { RedisRepository } from "./domain/repos/redis-repos.service";
import { RedisService } from "./redis/redis.service";
import { redisClientFactory } from "./redis/redis-client.factory";

@Module({
  imports: [RedisModule],
  controllers: [ChatController],
  providers: [
    ChatGatewayService,
    RedisRepository,
    RedisService,
    redisClientFactory,
  ],
})
export class ChatGatewayModule {}
