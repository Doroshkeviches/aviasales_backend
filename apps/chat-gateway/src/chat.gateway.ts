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

  @SubscribeMessage('join')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string,) {
    //connect to roomID
    client.join(roomId)

    this.server.to(roomId).emit('message', `successfully joined room ${roomId}`);


    await this.redisService.subToMessage(roomId, this.server)


    client.on('disconnect', (data) => { // подписка на дисконнект
      this.redisService.onDisconnect()
      console.log(`disconnect ${data}`)
    })
  }

  @SubscribeMessage("message") // отправляем сюда объект data с в котором roomId + message
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string, message: string },
  ) {
    

    const dat1 = await this.redisService.onSendMessage(data.roomId, data.message)
  }
}
