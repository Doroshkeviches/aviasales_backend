import {Body, Controller, Get, Post} from '@nestjs/common';
import {CurrentUser} from "@/src/libs/security/guards/security.guard";
import {User} from "@prisma/client";
import {getRoomId} from "@/src/libs/chat/utils";
import {user_id} from "@/src/types/user-id.type";
import {ChatGateway} from "@/src/app/chat/chat.gateway";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatGateway: ChatGateway) {}
    @Post()
    async createRoom(@CurrentUser() user: User, @Body() id: user_id) {
        const room_id = getRoomId(user.id, id);
        await this.chatGateway.handleRoomJoin({room_id});
    }

    @Get()
    async getMessages(@CurrentUser() user: User, @Body() id: string) {
        // call methods from controller to get messages
        // return await this.chatGateway.getMessages(id) <-- TODO: check auth here
    }
}
