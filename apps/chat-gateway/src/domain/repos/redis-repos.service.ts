import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server, Socket } from "socket.io";
import { MessageDto } from "../message.dto";
import { createClient } from 'redis'
@Injectable()
export class RedisRepository implements OnModuleDestroy {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) { }
    onSendMessage(roomId: string, message: string) {
        this.redisClient.publish(roomId, message)
    }
    async subToMessage(roomId: string, server: Server) {
        const subscribeClient = createClient()
        await subscribeClient.connect()
        return subscribeClient.subscribe(roomId, (value) => {
            console.log(value + 'SEVA')
            server.to(roomId).emit('message', value + '  emit inside sub');
        })
    }
    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }

    async saveUser(socket_id: string, id: string) {
        this.redisClient.set(socket_id, id);
    }

    async saveSocket(id: string, socket: Socket) {
        const socketJSON = JSON.stringify(socket);
        await this.redisClient.set(id, socketJSON);
    }

    async getSocket(user_id: string) {
        return this.redisClient.get(user_id);
    }

    async saveMessage(data: MessageDto) {
        const messageJson = JSON.stringify(data);
        await this.redisClient.zadd(`room:${data.room_id}`, data.date.valueOf(), messageJson);
    }

    async getUserIdBySocketId(id: string) {
        return this.redisClient.get(id);
    }

    async addUserToRoom(user_id: string, room_id: string) {
        return this.redisClient.sadd(`user:${user_id}:rooms`, room_id);
    }

    async isUserInRoom(user_id: string, room_id: string) {
        return this.redisClient.sismember(`user:${user_id}:rooms`, room_id);
    }

    async removeUserFromRooms(user_id: string, rooms: string[]) {
        return this.redisClient.srem(`user:${user_id}:rooms`, rooms);
    }

    async getUserRooms(user_id: string) {
        return this.redisClient.smembers(`user:${user_id}:rooms`);
    }

    async isExistingRoom(user_id: string, room_id: string) {
        return this.redisClient.sismember(`user:${user_id}:rooms`, room_id);
    }

    async getMessages(room_id: string) {
    }
}