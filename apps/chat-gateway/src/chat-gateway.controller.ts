import {Body, Controller, Get, HttpCode, UseGuards} from '@nestjs/common';
import {User, UserPermissions} from "@prisma/client";
import {ApiBody, ApiResponse} from "@nestjs/swagger";
import {RedisService} from "./redis/redis.service";
import {RoomDto} from "./domain/room.dto";
import {CurrentUser, JwtAuthGuard} from "@app/security/../../../libs/security/guards/security.guard";
import {RequirePermissions} from "@app/security/../../../libs/security/decorators/permission.decorator";

@Controller('chat')
export class ChatController {
  constructor(private readonly redisService: RedisService) {}

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
    console.log('getting messages...')
    // call methods from controller to get messages
    // return await this.chatGateway.getMessages(id) <-- TODO: check auth here
  }

  // TODO GET rooms for given user (e.g. - get all conversations)
}
