import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import {SecurityModule} from "@/src/libs/security/src";
import {DomainModule} from "@/src/domain";
import {RedisService} from "@/src/app/redis/redis.service";
import {AuthService} from "@/src/app/auth/auth.service";

@Module({
  providers: [ChatGateway, RedisService, AuthService],
  imports: [SecurityModule, DomainModule]
})
export class ChatModule {}
