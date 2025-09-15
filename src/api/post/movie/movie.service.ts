import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { MovieEntity } from 'src/core/entity/post/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from 'src/core/entity/users/admin.entity';
import { GenreEntity } from 'src/core/entity/post/genre.entity';
import { CountryEntity } from 'src/core/entity/post/country.entity';

@Injectable()
export class MovieService extends BaseService<
  CreateMovieDto,
  UpdateMovieDto,
  MovieEntity
> {
  constructor(
    // Movie
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,

    // Admin
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,

    // Genre
    @InjectRepository(GenreEntity)
    private readonly genreRepo: Repository<GenreEntity>,

    // Country
    @InjectRepository(CountryEntity)
    private readonly countryRepo: Repository<CountryEntity>,
  ) {
    super(movieRepo);
  }
  // ============================ CREATE MOVIE ============================

  async createMovie(createMovieDto: CreateMovieDto) {
    const { title, admin_id, genre_id, country_id } = createMovieDto;

    // check exist name
    const existName = await this.movieRepo.findOne({ where: { title } });
    
    // check is_deleted
    if (!existName?.is_deleted) {
      if (existName) {
        throw new ConflictException(
          `this name => ${title} alreaady exist on Movie`,
        );
      }
    } else {
      await this.remove(existName.id);
    }
    // check Admin id
    await this.findByIdRepository(this.adminRepo, admin_id);

    // check Genre id
    await this.findByIdRepository(this.genreRepo, genre_id);

    // check Country id
    await this.findByIdRepository(this.countryRepo, country_id);

    // create
    return super.create(createMovieDto);
  }

  // ============================ UPDATE MOVIE ============================

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const { title, admin_id, genre_id, country_id } = updateMovieDto;

    // check exist name
    if (title) {
      const existName = await this.movieRepo.findOne({ where: { title } });
      // check is_deleted
      if (!existName?.is_deleted) {
        if (existName) {
          throw new ConflictException(
            `this name => ${title} alreaady exist on Movie`,
          );
        }
      } else {
        await this.remove(existName.id);
      }
    }
    // check Admin id
    await this.findByIdRepository(this.adminRepo, Number(admin_id));

    // check Genre id
    await this.findByIdRepository(this.genreRepo, Number(genre_id));

    // check Country id
    await this.findByIdRepository(this.countryRepo, Number(country_id));

    // update
    return super.update(id, updateMovieDto);
  }
}
