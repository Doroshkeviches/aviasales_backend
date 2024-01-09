import { Module } from "@nestjs/common";
import { ChatController } from "./chat-gateway.controller";
import { ChatGatewayService } from "./chat-gateway.service";
import { SecurityModule } from "@app/security";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config_app from "../../../libs/security/config/app.config";
import config_i18n from "../../../libs/security/config/i18n.config";
import config_security from "../../../libs/security/config/security.config";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { APP_FILTER } from "@nestjs/core";
import { PrismaClientExceptionFilter } from "@app/exceptions/global-exception.filter";
import {RedisModule} from "./redis/redis.module";

@Module({
  imports: [
    SecurityModule,
      RedisModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [config_app, config_i18n, config_security],
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
      useFactory: (config: ConfigService) => config.get("i18n"),
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatGatewayService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class ChatGatewayModule {}
