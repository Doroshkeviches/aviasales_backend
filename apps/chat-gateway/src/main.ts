import { NestFactory } from '@nestjs/core';
import { ChatGatewayModule } from './chat-gateway.module';
import { createClient } from 'redis'
import * as cors from "cors";
async function bootstrap() {
  const app = await NestFactory.create(ChatGatewayModule);
  app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
  }));
  await app.listen(4444);
}
bootstrap();
