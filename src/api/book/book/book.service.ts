import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BaseService } from 'src/infrastructure/base/base-service';
import { BookEntity } from 'src/core/entity/book/book-entity';
import { ISuccessRes } from 'src/infrastructure/success-res/success-interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookService extends BaseService<
  CreateBookDto,
  UpdateBookDto,
  BookEntity
> {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepo: Repository<BookEntity>,
  ) {
    super(bookRepo);
  }

  // ------------------------- CREATE -------------------------
  async createBook(createDto: CreateBookDto) {
    const { title } = createDto;
    const exist = await this.bookRepo.findOne({ where: { title } });
    if (exist) {
      throw new ConflictException(
        `this book => ${title} already exist on Book`,
      );
    }
    return super.create(createDto);
  }

  // ------------------------- UPDATE -------------------------
  async updateBook(id: number, updateBook: UpdateBookDto) {
    // check id
    await this.findOneById(id);

    // exist title
    const { title } = updateBook;
    if (title) {
      const exist = await this.bookRepo.findOne({ where: { title } });
      if (exist) {
        throw new ConflictException(
          `this book => ${title} already exist on Book`,
        );
      }      
    }
    return super.update(id, updateBook);
  }
}
