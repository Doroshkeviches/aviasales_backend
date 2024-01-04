import {Inject, Injectable} from '@nestjs/common';
import {RedisRepository} from "@/src/domain/repos/redis-repos.service";
import {user_id} from "@/src/types/user-id.type";
import {UserSessionDto} from "@/src/libs/security/src/dtos/UserSessionDto";
import {Socket} from "socket.io";

@Injectable()
export class RedisService {
    constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {}

    /* TODO
    *   - create user name lookup by user id
    *   - associate rooms with users by id
    *   - associate socket ids with user ids
    *   - tbc...
    * */
    async saveUser(id: string, socket_id: string) {
        await this.redisRepository.saveUser(id, socket_id);
    }

    async getSocketByUserId(id: string) {
        return await this.redisRepository.getSocketByUserId(id);
    }

    async addUserToRoom(room_id: string, user_id: string) {
        return await this.redisRepository.addUserToRoom(room_id, user_id);
    }

    async isExistingRoom(room_id: string) {
        return this.redisRepository.isExistingRoom(room_id);
    }

    async getRoomUsers(room_id: string) {
        return await this.redisRepository.getRoomUsers(room_id);
    }
}
