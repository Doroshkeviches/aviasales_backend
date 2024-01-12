import { NestFactory } from '@nestjs/core';
import { ChatGatewayModule } from './chat-gateway.module';
import { createClient } from 'redis'
import * as cors from "cors";
async function bootstrap() {
  const app = await NestFactory.create(ChatGatewayModule);
  app.use(cors({ // без корсов у меня не работают запросы когда запускаю фронт и бэк локально (выключил корсы только на этап разработки)
    credentials: true,
    origin: "http://localhost:3000"
  }));
  await app.listen(4444);
}
bootstrap();
