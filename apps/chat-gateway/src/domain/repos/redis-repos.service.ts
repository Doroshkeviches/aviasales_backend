import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server, Socket } from "socket.io";
import { createClient } from 'redis'
import { User } from "@prisma/client";

@Injectable()
export class RedisRepository implements OnModuleDestroy {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) { }

    async onSendMessage(roomId: string, message: string) {
        const publishClient = createClient();
        await publishClient.connect();

        await publishClient.publish(roomId, message);
    }

    onIncomingRequest(user: Pick<User, 'id' | 'first_name' | 'last_name'>) {
        this.redisClient.publish('requests', JSON.stringify(user));
    }

    async subToRequestChannel(server: Server) {
        const subscribeClient = createClient();
        await subscribeClient.connect();

        await subscribeClient.subscribe('requests', (value) => {
            console.log('req')
            server.sockets.in('requests').emit('request', value)
        });
    }

    async subToMessage(roomId: string, server: Server, socket: Socket) {
        const subscribeClient = createClient()
        await subscribeClient.connect()
        await subscribeClient.subscribe(roomId, (value) => {
            server.to(socket.id).emit("message", value);
        })
    }

    onModuleDestroy(): void {
        this.redisClient.disconnect();
    }
}