import { Module } from '@nestjs/common';
import { DomainModule } from '@/src/domain';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import {SecurityModule} from "@app/security";

@Module({
  imports: [DomainModule, SecurityModule],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
