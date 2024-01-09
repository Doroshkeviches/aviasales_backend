import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { DomainModule } from '@/src/domain';
import {SecurityModule} from "@app/security";

@Module({
  imports: [DomainModule,SecurityModule],
  providers: [FlightsService],
  controllers: [FlightsController]
})
export class FlightsModule {}
