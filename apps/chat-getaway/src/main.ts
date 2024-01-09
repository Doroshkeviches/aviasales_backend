import { NestFactory } from '@nestjs/core';
import { ChatGetawayModule } from './chat-getaway.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatGetawayModule);
  await app.listen(3000);
}
bootstrap();
