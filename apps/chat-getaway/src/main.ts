import { NestFactory } from '@nestjs/core';
import { ChatGetawayModule } from './chat-getaway.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatGetawayModule, {
    logger: [process.env.LOG_LEVEL as any],
  });
  await app.listen(3000);
}
bootstrap();
