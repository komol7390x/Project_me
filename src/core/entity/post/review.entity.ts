import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';
import { MovieEntity } from 'src/core/entity/post/movie.entity';

@Entity('review')
export class ReviewEntity extends BaseEntity {
  // ---------------------------- COMMENT ----------------------------

  @Column({ type: 'text' })
  comment: string;

  // ---------------------------- RATING ----------------------------

  @Column({ type: 'int', default: 5 })
  rating: number;

  // ---------------------------- CUSTOMER ID ----------------------------

  @Column({ type: 'int' })
  customer_id: number;

  // ---------------------------- MOVIE ID ----------------------------

  @Column({ type: 'int' })
  movie_id: number;

  // ---------------------------- CUSTOMER RELATION ----------------------------

  @ManyToOne(() => CustomerEntity, (customer) => customer.reviews, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  // ---------------------------- MOVIE RELATION ----------------------------

  @ManyToOne(() => MovieEntity, (movie) => movie.reviews, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;
}
