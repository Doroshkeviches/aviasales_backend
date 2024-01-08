import { Controller, Get } from '@nestjs/common';
import { ChatGetawayService } from './chat-getaway.service';

@Controller()
export class ChatGetawayController {
  constructor(private readonly chatGetawayService: ChatGetawayService) {}

  @Get()
  getHello(): string {
    return this.chatGetawayService.getHello();
  }
}
