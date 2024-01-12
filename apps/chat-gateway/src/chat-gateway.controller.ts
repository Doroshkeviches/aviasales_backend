import {Body, Controller, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import { User, UserPermissions } from "@prisma/client";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { RedisService } from "./redis/redis.service";
import { CurrentUser, JwtAuthGuard } from "@app/security/../../../libs/security/guards/security.guard";
@Controller('chat')
export class ChatController {
  constructor(private readonly redisService: RedisService) { }

  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully received messages',
  // })
  // @HttpCode(200)
  // @ApiBody({ type: RoomDto })
  // // @UseGuards(JwtAuthGuard)
  // // @RequirePermissions(UserPermissions.AccessChat)
  // @Get()
  // async getMessages(@CurrentUser() user: User, @Body() room: RoomDto) {
  //
  //
  //   // call methods from controller to get messages
  //   // return await this.chatGateway.getMessages(id) <-- TODO: check auth here
  // }

  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully started chat',
  // })
  // @HttpCode(200)
  // // @UseGuards(JwtAuthGuard)
  // // @RequirePermissions(UserPermissions.AccessChat)
  // @Get()
  // async getIncomingRequests (@CurrentUser() user: User) {
  //   const requests = await this.redisService.getIncomingRequests();
  //   console.log(requests);
  // }

}
