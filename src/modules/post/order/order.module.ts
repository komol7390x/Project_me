import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Customer } from 'src/modules/users/customer/entities/customer.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Customer,Product])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
