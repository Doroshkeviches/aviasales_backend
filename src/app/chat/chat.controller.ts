import {Body, Controller, Get, HttpCode, UseGuards} from '@nestjs/common';
import {CurrentUser, JwtAuthGuard} from "@/src/libs/security/guards/security.guard";
import {User, UserPermissions} from "@prisma/client";
import {ChatGateway} from "@/src/app/chat/chat.gateway";
import {RequirePermissions} from "@/src/libs/security/decorators/permission.decorator";
import {RoomDto} from "@/src/app/chat/domain/room.dto";
import {ApiBody, ApiResponse} from "@nestjs/swagger";
import {RedisService} from "@/src/app/redis/redis.service";

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
