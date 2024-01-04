import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './app/auth/auth.module';
import { CityModule } from './app/city/city.module';

import config_app from './config/app.config';
import config_i18n from './config/i18n.config';
import config_security from './config/security.config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './libs/exceptions/global-exception.filter';
import { FlightsModule } from './app/flights/flights.module';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    AuthModule,
    CityModule,
    FlightsModule,
    UserModule,
    ConfigModule.forRoot({
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
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule {}
