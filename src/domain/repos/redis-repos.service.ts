import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import {UserSessionDto} from "@/src/libs/security/src/dtos/UserSessionDto";

@Injectable()
export class RedisRepository implements OnModuleDestroy {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    async saveUser(id: string, socket_id: string) {
        this.redisClient.set(id, socket_id);
    }

    async getSocketByUserId(id: string) {
        return this.redisClient.get(id);
    }

    async addUserToRoom(room_id: string, user_id: string) {
        return this.redisClient.sadd(`room:${room_id}:users`, user_id);
    }

    async getRoomUsers(room_id: string) {
        return this.redisClient.smembers(`room:${room_id}:users`);
    }

    async isExistingRoom(room_id: string) {
        return this.redisClient.exists(`room:${room_id}:users`);
    }
        async get(prefix: string, key: string): Promise<string | null> {
        return this.redisClient.get(`${prefix}:${key}`);
    }

    async set(prefix: string, key: string, value: string): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value);
    }

    async delete(prefix: string, key: string): Promise<void> {
        await this.redisClient.del(`${prefix}:${key}`);
    }

    async setWithExpiry(prefix: string, key: string, value: string, expiry: number): Promise<void> {
        await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    }
}