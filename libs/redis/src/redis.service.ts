import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

import { RequestDto } from "../../../apps/chat-gateway/src/domain/request.dto";
import { MessageForm } from "../../../apps/chat-gateway/src/domain/message.form";
import { RoomDto } from "../../../apps/chat-gateway/src/domain/room.dto";

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get("REDIS_HOST");
    const port = this.config.get("REDIS_PORT");
    this.client = new Redis({ host, port });
  }

  async saveMessage(message: MessageForm) {
    await this.client.zadd(
      `room:${message.room_id}:messages`,
      message.created_at,
      JSON.stringify(message),
    );
    await this.client.expire(`room:${message.room_id}:messages`, 86400);
  }

  async addRoom(room: RequestDto) {
    await this.client.hmset(`room:${room.id}`, room);
  }

  async isRoomInStore(roomId: string) {
    const roomKey = `room:${roomId}`;
    const exists = await this.client.exists(roomKey);
    return exists === 1;
  }

  async getAllMessages(roomId: string) {
    const messages = await this.client.zrange(`room:${roomId}:messages`, 0, -1);
    return messages.map((messageJson) => JSON.parse(messageJson));
  }

  async getRooms() {
    const roomKeys = await this.client.keys("room:*[^:messages]");

    const roomPromises = roomKeys.map(async (roomKey) => {
      return this.client.hgetall(roomKey) as unknown as RoomDto;
    });

    return await Promise.all(roomPromises);
  }
}
