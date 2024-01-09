import {Body, Controller, Get, HttpCode, UseGuards} from '@nestjs/common';
import {CurrentUser, JwtAuthGuard} from "@/src/libs/security/guards/security.guard";
import {User, UserPermissions} from "@prisma/client";
import {RequirePermissions} from "@/src/libs/security/decorators/permission.decorator";
import {ApiBody, ApiResponse} from "@nestjs/swagger";
import {RedisService} from "./redis/redis.service";
import {ChatGateway} from "./chat.gateway";
import {RoomDto} from "./domain/room.dto";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway,
              private readonly redisService: RedisService) {}

  @ApiResponse({
    status: 200,
    description: 'Successfully received messages',
  })
  @HttpCode(200)
  @ApiBody({ type: RoomDto })
  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.AccessChat)
  @Get()
  async getMessages(@CurrentUser() user: User, @Body() room: RoomDto) {
    // call methods from controller to get messages
    // return await this.chatGateway.getMessages(id) <-- TODO: check auth here
  }

  // TODO GET rooms for given user (e.g. - get all conversations)
}
