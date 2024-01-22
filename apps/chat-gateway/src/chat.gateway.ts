import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { RedisService } from "@app/redis";
import { SecurityService } from "@app/security";
import { JwtAuthGuard } from "@app/security/guards/security.guard";
import { UserSessionDto } from "@app/security/dtos/UserSessionDto";
import { RequirePermissions } from "@app/security/decorators/permission.decorator";

import { ErrorCodes } from "@app/exceptions/enums/error-codes.enum";
import { ApiException } from "@app/exceptions/api-exception";

import { ChatEventsEnum } from "./domain/chat-events.enum";
import { MessageDto } from "./domain/message.dto";
import { RequestDto } from "./domain/request.dto";

import { UseGuards } from "@nestjs/common";
import { UserPermissions } from "@prisma/client";

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(
    private readonly redisService: RedisService,
    private readonly securityService: SecurityService,
  ) {}
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {}

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.PublishToRooms)
  @SubscribeMessage(ChatEventsEnum.ConnectUser)
  async handleUserConnection(@ConnectedSocket() client: Socket) {
    const userDto = UserSessionDto.fromPayload(client.data.user);
    const user = await this.securityService.getUserById({ id: userDto.id });

    if (!user) throw new ApiException(ErrorCodes.NoUser);

    await client.join(user.id);

    const room = await this.redisService.isRoomInStore(user.id);
    if (!room) {
      await this.redisService.addRoom(user.id);
      const requestDto = RequestDto.toEntity(user);
      this.server.to("rooms").emit("new-chat", requestDto);
    }
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.SubscribeToRooms)
  @SubscribeMessage(ChatEventsEnum.ConnectManager)
  async handleManagerConnection(@ConnectedSocket() client: Socket) {
    const userDto = UserSessionDto.fromPayload(client.data.user);
    const manager = await this.securityService.getManagerById({ id: userDto.id });

    if (!manager) throw new ApiException(ErrorCodes.NoUser);

    await client.join("rooms");
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.JoinRoom)
  @SubscribeMessage(ChatEventsEnum.JoinRoom)
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Pick<MessageDto, "room_id">,
  ) {
    client.join(data.room_id);
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetMessages)
  @SubscribeMessage(ChatEventsEnum.GetMessages)
  async handleMessagesGet(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Pick<MessageDto, "room_id">,
  ) {
    const messages = await this.redisService.getAllMessages(data.room_id);
    this.server.to(client.id).emit("messages", messages);
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.GetRooms)
  @SubscribeMessage(ChatEventsEnum.GetRooms)
  async handleRoomsGet(@ConnectedSocket() client: Socket) {
    const rooms = await this.redisService.getRooms();
    this.server.to(client.id).emit("rooms", rooms);
  }

  @UseGuards(JwtAuthGuard)
  @RequirePermissions(UserPermissions.SendMessages)
  @SubscribeMessage(ChatEventsEnum.Message)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDto,
  ) {
    data.created_at = new Date().getTime();
    await this.redisService.saveMessage(data);
    this.server.to(data.room_id).except(client.id).emit("message", data);
  }

  async handleDisconnect(client: Socket) {}
}
