import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Saller } from 'src/modules/users/saller/entities/saller.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product,Saller,Category])],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule {}
