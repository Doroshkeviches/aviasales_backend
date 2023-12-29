import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { DomainModule } from '@/src/domain';
import { SecurityModule } from '@/src/libs/security/src';

@Module({
  imports: [DomainModule,SecurityModule],
  providers: [FlightsService],
  controllers: [FlightsController]
})
export class FlightsModule {}
