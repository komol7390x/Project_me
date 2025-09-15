import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/core/entity/post/review.entity';
import { MovieEntity } from 'src/core/entity/post/movie.entity';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity,MovieEntity,CustomerEntity])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
