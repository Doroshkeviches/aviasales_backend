import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DomainModule } from '@/src/domain';
import { SecurityModule } from '@/src/libs/security/src';

@Module({
  imports: [DomainModule,SecurityModule],
  providers: [RoleService],
  controllers: [RoleController]
})
export class RoleModule {}
