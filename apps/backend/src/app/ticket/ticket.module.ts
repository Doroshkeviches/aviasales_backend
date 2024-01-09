import { Module } from '@nestjs/common';
import { DomainModule } from '@/src/domain';
import { SecurityModule } from 'apps/libs/security/src';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';

@Module({
  imports: [DomainModule, SecurityModule],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
