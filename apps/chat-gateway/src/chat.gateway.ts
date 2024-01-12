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
import { User, UserPermissions, UserRoles } from "@prisma/client";
import { RedisService } from "./redis/redis.service";
import { MessageDto } from "./domain/message.dto";
import { JwtAuthGuard } from "../../../libs/security/guards/security.guard";
import { SecurityService } from "@app/security";
import { UserSessionDto } from "@app/security/dtos/UserSessionDto";
import { RequestDto } from "./domain/request.dto";
import {uuid} from "uuidv4";

@WebSocketGateway({ cors: '*:*' })
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(
    private readonly redisService: RedisService,
    private readonly securityService: SecurityService,
  ) { }
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  // @UseGuards(JwtAuthGuard)
  // require permissions <- for manager only
  @SubscribeMessage("join-requests-channel")
  async joinRequestsChannel(@ConnectedSocket() client: Socket) {
    client.join('requests');
    console.log("joined request channel");
    this.server.to(client.id).emit('message', `successfully joined room requests`); // remove this later
    await this.redisService.subToRequestChannel(this.server);
  }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage("accept-request")
  async acceptRequest(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    client.join(userId);
    client.to(userId).emit('message', `manager joined chat`); // remove this later
    await this.redisService.subToMessage(userId, this.server,client);
  }
  
  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage("join-chat")
  // for user
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {

    client.join(roomId);
    client.to(roomId).emit('message', `manager joined chat`); // remove this later

    // this.server.to(roomId).emit('message', `successfully joined room ${roomId}`); // remove this later

    // console.log(client.data);
    // const userDto = UserSessionDto.fromPayload(client.data.user);
    // const user = await this.securityService.getUserById({id: userDto.id});
    // const requestDto = RequestDto.toEntity(user);
    const requestDto = RequestDto.toEntity({
      id: uuid(),
      first_name: 'AAAA',
      last_name: 'BBBB'
    });

    await this.redisService.onRequest(requestDto);

    await this.redisService.subToMessage(roomId, this.server,client);
  }

  @SubscribeMessage("message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageDto,
  ) {
    await this.redisService.onSendMessage(data.room_id, data.message)
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    await this.redisService.onDisconnect();
  }
}
