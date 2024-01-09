import { Module } from '@nestjs/common';
import { ChatGetawayController } from './chat-getaway.controller';
import { ChatGetawayService } from './chat-getaway.service';
import { SecurityModule } from 'apps/libs/security/src';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config_app from '../../libs/security/config/app.config';
import config_i18n from '../../libs/security/config/i18n.config';
import config_security from '../../libs/security/config/security.config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'apps/libs/exceptions/global-exception.filter';
@Module({
  imports: [SecurityModule, ConfigModule.forRoot({
    envFilePath: '.env',
    load: [config_app, config_i18n, config_security],
    isGlobal: true,
  }),
  I18nModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    resolvers: [
      { use: QueryResolver, options: ['lang'] },
      AcceptLanguageResolver,
    ],
    useFactory: (config: ConfigService) => config.get('i18n'),
  }),],
  controllers: [ChatGetawayController],
  providers: [ChatGetawayService,{
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter,
  },],
})
export class ChatGetawayModule { }
