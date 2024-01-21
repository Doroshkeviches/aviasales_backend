import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

import { MessageDto } from "../../../apps/chat-gateway/src/domain/message.dto";

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get("REDIS_HOST");
    const port = this.config.get("REDIS_PORT");
    this.client = new Redis({ host, port });
  }

  async saveMessage(message: MessageDto) {
    await this.client.lpush(message.room_id, JSON.stringify(message), "EX", 86400);
  }

  async addRoom(roomId: string) {
    await this.client.sadd("rooms", roomId, "EX", 86400);
  }

  async isRoomInStore(roomId: string) {
    return this.client.sismember("rooms", roomId);
  }

  async getAllMessages(roomId: string) {
    const messages = await this.client.lrange(roomId, 0, -1);
    return messages.map((messageJson) => JSON.parse(messageJson));
  }

  async getRooms() {
    return this.client.smembers("rooms");
  }

}
