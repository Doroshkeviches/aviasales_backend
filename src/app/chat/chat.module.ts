import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import {RedisModule} from "@/src/app/redis/redis.module";
import {AuthModule} from "@/src/app/auth/auth.module";

@Module({
  providers: [ChatGateway],
  imports: [AuthModule, RedisModule]
})
export class ChatModule {}
