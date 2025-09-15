import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from 'src/core/entity/post/review.entity';
import { MovieEntity } from 'src/core/entity/post/movie.entity';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';

@Injectable()
export class ReviewService extends BaseService<
  CreateReviewDto,
  UpdateReviewDto,
  ReviewEntity
> {
  constructor(
    // review
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,

    // movie
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,

    // customer
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
  ) {
    super(reviewRepo);
  }

  // ============================ CREATE REVIEW ============================

  async createReview(createReviewDto: CreateReviewDto) {
    // distructure
    const { movie_id, customer_id } = createReviewDto;

    // check movie id
    await this.findByIdRepository(this.movieRepo, movie_id);

    // check customer id
    await this.findByIdRepository(this.customerRepo, customer_id);

    // create
    return super.create(createReviewDto);
  }

  // ============================ UPDATE REVIEW ============================

  async updateReview(id: number, updateReviewDto: UpdateReviewDto) {
    // distructure
    const { movie_id, customer_id } = updateReviewDto;

    // check movie id
    if (movie_id) {
      await this.findByIdRepository(this.movieRepo, movie_id);
    }

    // check customer id
     if (customer_id) {
       await this.findByIdRepository(this.customerRepo, customer_id);
     }
    // update
    return super.update(id, updateReviewDto);
  }
}
