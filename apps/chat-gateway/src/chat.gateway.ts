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
import {v4} from "uuid";

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(
    private readonly redisService: RedisService,
    private readonly securityService: SecurityService,
  ) {}
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {}

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.PublishToRooms)
  @SubscribeMessage(ChatEventsEnum.ConnectUser)
  async handleUserConnection(@ConnectedSocket() client: Socket) {
    // const userDto = UserSessionDto.fromPayload(client.data.user);
    // const user = await this.securityService.getUserById({ id: userDto.id });

    const user = {
      id: v4(),
      email: "user@user.com",
      device_id: v4(),
      first_name: "John",
      last_name: "Doe"
    }

    if (!user) throw new ApiException(ErrorCodes.NoUser);
    console.log(`user ${user.id} connected`)
    await client.join(user.id);

    const room = await this.redisService.isRoomInStore(user.id);
    console.log("room?", room);
    if (!room) {
      const requestDto = RequestDto.toEntity(user);
      await this.redisService.addRoom(requestDto);
      this.server.to("rooms").emit("new-chat", requestDto);
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.SubscribeToRooms)
  @SubscribeMessage(ChatEventsEnum.ConnectManager)
  async handleManagerConnection(@ConnectedSocket() client: Socket) {
    // const userDto = UserSessionDto.fromPayload(client.data.user);
    // const manager = await this.securityService.getManagerById({ id: userDto.id });

    const manager = {
      id: v4(),
      email: "manager@manager.com",
      device_id: v4(),
      first_name: "ALex",
      last_name: "A"
    }

    console.log(`manager ${manager.id} connected`)

    if (!manager) throw new ApiException(ErrorCodes.NoUser);

    await client.join("rooms");
  }

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.JoinRoom)
  @SubscribeMessage(ChatEventsEnum.JoinRoom)
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Pick<MessageDto, "room_id">,
  ) {
    client.join(data.room_id);
  }

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.GetMessages)
  @SubscribeMessage(ChatEventsEnum.GetMessages)
  async handleMessagesGet(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Pick<MessageDto, "room_id">,
  ) {
    const messages = await this.redisService.getAllMessages(data.room_id);
    this.server.to(client.id).emit("messages", messages);
  }

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.GetRooms)
  @SubscribeMessage(ChatEventsEnum.GetRooms)
  async handleRoomsGet(@ConnectedSocket() client: Socket) {
    const rooms = await this.redisService.getRooms();
    this.server.to(client.id).emit("rooms", rooms);
  }

  // @UseGuards(JwtAuthGuard)
  // @RequirePermissions(UserPermissions.SendMessages)
  @SubscribeMessage(ChatEventsEnum.Message)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDto,
  ) {
    data.id = v4();
    data.created_at = new Date().getTime();
    await this.redisService.saveMessage(data);
    this.server.to(data.room_id).emit("message", data);
  }

  async handleDisconnect(client: Socket) {}
}
