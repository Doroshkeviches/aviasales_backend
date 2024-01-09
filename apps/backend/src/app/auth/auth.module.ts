import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DomainModule } from '@/src/domain';
import { SecurityModule, SecurityService } from 'apps/libs/security/src';

@Module({
  imports: [DomainModule,SecurityModule],
  providers: [AuthService,SecurityService],
  controllers: [AuthController]
})
export class AuthModule {}
