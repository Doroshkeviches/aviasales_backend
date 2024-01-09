import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { AuthService } from "@/src/app/auth/auth.service";
import { User, UserPermissions } from "@prisma/client";
import { RedisService } from "./redis/redis.service";
import { MessageDto } from "./domain/message.dto";
import { getRoomId } from "./libs/utils";
import { JwtAuthGuard } from "@app/security/../../../libs/security/guards/security.guard";
import { RequirePermissions } from "@app/security/../../../libs/security/decorators/permission.decorator";
import { createClient } from 'redis'
// TODO: message exchange should be moved to pub/sub?

@WebSocketGateway()
export class ChatGateway {
  constructor(
    private readonly redisService: RedisService,
    // private readonly authService: AuthService,
  ) { }
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;
  // @UseGuards(JwtAuthGuard)

  @SubscribeMessage('room')
  async joinRoom(socket: Socket, roomId: string) {
    console.log(roomId)
    socket.join(roomId)
    this.server.to(roomId).emit('a new challenger approaches');
    await this.redisService.subToMessage(roomId)
    
  }



  @SubscribeMessage("message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const dat1 = await this.redisService.onSendMessage(data.roomId, data.message)
  }
}
