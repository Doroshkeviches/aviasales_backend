import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import Redis from "ioredis";

import {MessageDto} from "../../../apps/chat-gateway/src/domain/message.dto";
import {RequestDto} from "../../../apps/chat-gateway/src/domain/request.dto";

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get("REDIS_HOST");
    const port = this.config.get("REDIS_PORT");
    this.client = new Redis({ host, port });
  }

  async saveMessage(message: MessageDto) {
    await this.client.lpush(message.room_id, JSON.stringify(message));
    await this.client.expire(message.room_id, 86400);
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
    const messages = await this.client.lrange(roomId, 0, -1);
    return messages.map((messageJson) => JSON.parse(messageJson));
  }

  async getRooms() {
    const roomKeys = await this.client.keys('room:*');

    const roomPromises = roomKeys.map(async (roomKey) => {
      const roomData = await this.client.hgetall(roomKey);
      return roomData;
    })

    const rooms = await Promise.all(roomPromises);

    return rooms.map((roomData) => ({
      id: roomData.id,
      first_name: roomData.first_name,
      last_name: roomData.last_name
    }));
  }

}
