import { NestFactory } from '@nestjs/core';
import { ChatGatewayModule } from './chat-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatGatewayModule);
  await app.listen(4444);
}
bootstrap();
