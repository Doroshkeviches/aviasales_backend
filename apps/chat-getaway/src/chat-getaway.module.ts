import { Module } from '@nestjs/common';
import { ChatGetawayController } from './chat-getaway.controller';
import { ChatGetawayService } from './chat-getaway.service';

@Module({
  imports: [],
  controllers: [ChatGetawayController],
  providers: [ChatGetawayService],
})
export class ChatGetawayModule {}
