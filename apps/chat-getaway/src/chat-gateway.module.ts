import { Module } from '@nestjs/common';
import { ChatController } from './chat-gateway.controller';
import { ChatGatewayService } from './chat-gateway.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatGatewayService],
})
export class ChatGatewayModule {}
