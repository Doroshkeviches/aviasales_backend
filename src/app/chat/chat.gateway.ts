import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {Logger, UseGuards} from "@nestjs/common";
import {RedisService} from "@/src/app/redis/redis.service";
import {UserSessionDto} from "@/src/libs/security/src/dtos/UserSessionDto";
import {AuthService} from "@/src/app/auth/auth.service";
import {getRoomId} from "@/src/libs/chat/utils";
import {User, UserRoles} from "@prisma/client";
import {JwtAuthGuard} from "@/src/libs/security/guards/security.guard";

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly redisService: RedisService,
              private readonly authService: AuthService) {}
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket, @MessageBody() data: {user: UserSessionDto}) {

    // associate user id with socket id

    const userId = data.user.id;

    // user may try to reconnect, so the record could already exist
    const record = await this.redisService.getSocketByUserId(userId);
    if (!record) {
      await this.redisService.saveUser(userId, JSON.stringify(client));
    }

    // also makes sense to join user back to the room after disconnect
    // but before that we need to check whether that room exists

    this.logger.log(`User with id ${userId} connected`);
  }

  // TODO: change type to uuid
  @SubscribeMessage("room:join")
  // is called once from client to connect user with sales
  async handleRoomJoin(@ConnectedSocket() client: Socket, @MessageBody() data: {user: User}) {
    // we need to check users role before joining the room
    if (data.user.role_type !== UserRoles.Client) {
      return;
    }

    const salesManager = await this.authService.getSalesManager();
    const salesManagerSocketJson = await this.redisService.getSocketByUserId(salesManager.id);
    const salesManagerSocket = JSON.parse(salesManagerSocketJson) as Socket;

    const roomId = getRoomId(data.user.id, salesManager.id);

    client.join(roomId);
    client.emit("room:join", roomId);

    salesManagerSocket.join(roomId);
    salesManagerSocket.emit("room:join", roomId);

    await this.redisService.addUserToRoom(roomId, data.user.id);
    await this.redisService.addUserToRoom(roomId, salesManager.id);
    // check whether the room already exists
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    // const socketId = client.id;
    // const userName = users[socketId];
    // delete users[socketId];
    //
    // client.broadcast.emit("log", `${userName} disconnected`);
  }
}
