import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieEntity } from 'src/core/entity/post/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entity/users/admin.entity';
import { GenreEntity } from 'src/core/entity/post/genre.entity';
import { CountryEntity } from 'src/core/entity/post/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieEntity,
      AdminEntity,
      GenreEntity,
      CountryEntity,
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
