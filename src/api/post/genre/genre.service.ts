import { ConflictException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { GenreEntity } from 'src/core/entity/post/genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { successRes } from 'src/infrastructure/response/succesRes';

@Injectable()
export class GenreService extends BaseService<
  CreateGenreDto,
  UpdateGenreDto,
  GenreEntity
> {
  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepo: Repository<GenreEntity>,
  ) {
    super(genreRepo);
  }

  // ============================ CREATE GENRE ============================

  async createGenre(createGenreDto: CreateGenreDto) {
    const { name } = createGenreDto;

    // check exist name
    const existName = await this.genreRepo.findOne({ where: { name } });

    // check is_deleted
    if (!existName?.is_deleted) {
      if (existName) {
        throw new ConflictException(
          `this name => ${name} alreaady exist on Genre`,
        );
      }
    } else {
      await this.remove(existName.id);
    }

    // create
    return super.create(createGenreDto);
  }

  // ============================ UPDATE GENRE ============================
  async updateGenre(id: number, updateGenreDto: UpdateGenreDto) {
    const { name } = updateGenreDto;

    // check exist name
    if (name) {
      const existName = await this.genreRepo.findOne({ where: { name } });
      if (!existName?.is_deleted) {
        if (existName) {
          throw new ConflictException(
            `this name => ${name} alreaady exist on Genre`,
          );
        }
      } else {
        await this.remove(existName.id);
      }
    }

    // update
    return super.update(id, updateGenreDto);
  }
}
