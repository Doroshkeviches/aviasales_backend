import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DomainModule } from '@/src/domain';
import { SecurityModule } from '@app/security';

@Module({
  imports: [DomainModule, SecurityModule],
  providers: [DevicesService],
  controllers: [DevicesController]
})
export class DevicesModule { }
