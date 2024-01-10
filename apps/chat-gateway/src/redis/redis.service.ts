import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from "../domain/repos/redis-repos.service";
import { Server, Socket } from "socket.io";
import { MessageDto } from "../domain/message.dto";

@Injectable()
export class RedisService {
    constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) { }

    /* TODO
    *   - create user name lookup by user id
    *   - associate rooms with users by id
    *   - associate socket ids with user ids
    *   - tbc...
    * */

    async onDisconnect() {
        return this.redisRepository.onModuleDestroy()
    }
    async onSendMessage(roomId: string, message: string) {
        return this.redisRepository.onSendMessage(roomId, message)
    }
    async subToMessage(roomId: string, server: Server) {
        return this.redisRepository.subToMessage(roomId,server)
    }
    async saveUser(socket_id: string, id: string) {
        await this.redisRepository.saveUser(id, socket_id);
    }

    async saveSocket(id: string, socket: Socket) {
        await this.redisRepository.saveSocket(id, socket);
    }

    async getSocket(user_id: string) {
        return await this.redisRepository.getSocket(user_id);
    }

    async saveMessage(data: MessageDto) {
        await this.redisRepository.saveMessage(data);
    }

    async getUserIdBySocketId(id: string) {
        return await this.redisRepository.getUserIdBySocketId(id);
    }

    async addUserToRoom(user_id: string, room_id: string) {
        return await this.redisRepository.addUserToRoom(room_id, user_id);
    }

    async isUserInRoom(user_id: string, room_id: string) {
        return await this.redisRepository.isUserInRoom(user_id, room_id);
    }

    async getUserRooms(user_id: string) {
        return await this.redisRepository.getUserRooms(user_id);
    }

    async removeUserFromRooms(user_id: string, rooms: string[]) {
        return this.redisRepository.removeUserFromRooms(user_id, rooms);
    }

    async getMessages(room_id: string) {
        return await this.redisRepository.getMessages(room_id);
    }


}
