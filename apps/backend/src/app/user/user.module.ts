import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DomainModule } from '@/src/domain';
import {SecurityModule} from "@app/security";

@Module({
  imports: [DomainModule, SecurityModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
