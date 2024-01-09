import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DomainModule } from '@/src/domain';
import { SecurityModule } from 'apps/libs/security/src';

@Module({
  imports: [DomainModule, SecurityModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
