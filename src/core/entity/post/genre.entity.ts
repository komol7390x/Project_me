import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MovieEntity } from './movie.entity';

@Entity('genre')
export class GenreEntity extends BaseEntity {
  // -------------------- NAME --------------------

  @Column({ type: 'varchar', unique: true })
  name: string;
  
  // ================================= REALATION =================================

  // -------------------- MOVIES --------------------

  @OneToMany(() => MovieEntity, (movie) => movie.genre, {
    cascade: true,
  })
  movies: MovieEntity[];
}
