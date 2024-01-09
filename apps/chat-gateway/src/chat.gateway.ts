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
import {JwtAuthGuard} from "@app/security/../../../libs/security/guards/security.guard";
import {RequirePermissions} from "@app/security/../../../libs/security/decorators/permission.decorator";

// TODO: message exchange should be moved to pub/sub?

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @WebSocketServer() server: Server;

  @UseGuards(JwtAuthGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.data.user.id;
    await this.redisService.saveUser(client.id, userId); // socket_id -> user_id
    await this.redisService.saveSocket(userId, client); // user_id -> socket
    this.logger.log(`User with id ${userId} connected`);
    return userId;
  }

  /*
   *
   *
   * */
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDto,
  ) {
    const roomId = data.room_id;
    const userIds = roomId.split(":");

    const currentSocketId = client.id;
    const currentUserId =
      await this.redisService.getUserIdBySocketId(currentSocketId);

    const receiverUserId = userIds.find((id) => currentUserId !== id);
    const isReceiverInRoom = this.redisService.isUserInRoom(
      receiverUserId,
      roomId,
    );

    if (!isReceiverInRoom) {
      // join manager to room
      const receiverSocketJson =
        await this.redisService.getSocket(receiverUserId);
      const receiverSocket = JSON.parse(receiverSocketJson);
      await this.redisService.addUserToRoom(roomId, receiverUserId);
      this.server.in(receiverSocket.id).socketsJoin(roomId);
    }

    this.server.to(roomId).emit(data.message);
    await this.redisService.saveMessage(data);

    return roomId;
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.StartChat)
  @SubscribeMessage("room:join")
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { user: User },
  ) {
    const salesManager = await this.authService.getSalesManager();
    // const salesManagerSocketJson = await this.redisService.getSocketByUserId(salesManager.id);
    // const salesManagerSocket = JSON.parse(salesManagerSocketJson) as Socket;

    const roomId = getRoomId(data.user, salesManager);

    client.join(roomId);
    client.emit("room:join", roomId);

    // salesManagerSocket.join(roomId);
    // salesManagerSocket.emit("room:join", roomId);

    await this.redisService.addUserToRoom(roomId, data.user.id);
    // await this.redisService.addUserToRoom(roomId, salesManager.id); TODO: move to recievemessage
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.AccessChat)
  @SubscribeMessage("room:join")
  afterInit(server: Server) {}

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    /*TODO:
       - remove all user rooms
       - clear message history
       - remove user_id -> socket string
       - remove socket_id -> user_id string
    */

    const userId = await this.redisService.getUserIdBySocketId(client.id);
    const rooms = await this.redisService.getUserRooms(userId);

    this.logger.log("rooms: ", rooms);

    await this.redisService.removeUserFromRooms(userId, rooms);
  }
}
