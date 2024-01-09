import { Module } from "@nestjs/common";
import { ChatController } from "./chat-gateway.controller";
import { ChatGatewayService } from "./chat-gateway.service";
import { RedisModule } from "./redis/redis.module";
import { SecurityModule } from "@app/security";
import { DomainModule } from "@/src/domain";
import { ConfigModule } from "@nestjs/config";
import config_app from "@/src/config/app.config";
import config_i18n from "@/src/config/i18n.config";
import config_security from "@/src/config/security.config";

@Module({
  imports: [
    RedisModule,
    SecurityModule,
    DomainModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [config_app, config_i18n, config_security],
      isGlobal: true,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGatewayService],
})
export class ChatGatewayModule {}
