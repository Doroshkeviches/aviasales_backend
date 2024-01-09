import { Controller, Get, UseGuards } from '@nestjs/common';
import { ChatGetawayService } from './chat-getaway.service';
import { JwtAuthGuard } from 'apps/libs/security/guards/security.guard';

@Controller()
export class ChatGetawayController {
  constructor(private readonly chatGetawayService: ChatGetawayService) { }
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.chatGetawayService.getHello();
  }
}
