import {HttpAdapterHost, NestFactory} from "@nestjs/core";
import { ChatGatewayModule } from "./chat-gateway.module";
import { RedisIoAdapter } from "@app/redis/redis-io.adapter";
import * as cors from "cors";
import {ValidationPipe} from "@nestjs/common";
import {WsExceptionFilter} from "@app/exceptions/ws-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(ChatGatewayModule);

  app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
  }));

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new WsExceptionFilter());

  await app.listen(4444);
}
bootstrap();
