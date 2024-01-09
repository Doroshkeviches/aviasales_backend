import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { DomainModule } from '@/src/domain';
import { SecurityModule } from 'apps/libs/security/src';

@Module({
  imports: [DomainModule, SecurityModule],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule {}
