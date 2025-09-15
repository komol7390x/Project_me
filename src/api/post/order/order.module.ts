import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/core/entity/post/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';
import { TicketEntity } from 'src/core/entity/post/ticket.entity';
import { MovieEntity } from 'src/core/entity/post/movie.entity';
import { MovieService } from '../movie/movie.service';
import { AdminEntity } from 'src/core/entity/users/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      CustomerEntity,
      MovieEntity,
      TicketEntity,
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
