import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'src/core/entity/post/ticket.entity';
import { ShowtimeEntity } from 'src/core/entity/post/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, ShowtimeEntity])],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
