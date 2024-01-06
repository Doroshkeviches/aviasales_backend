import {Inject, Injectable} from '@nestjs/common';
import {RedisRepository} from "@/src/domain/repos/redis-repos.service";
import {Socket} from "socket.io";
import {MessageDto} from "@/src/app/chat/domain/message.dto";

@Injectable()
export class RedisService {
    constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {}

    /* TODO
    *   - create user name lookup by user id
    *   - associate rooms with users by id
    *   - associate socket ids with user ids
    *   - tbc...
    * */
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

    async getUserIdBySocketId (id: string) {
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
