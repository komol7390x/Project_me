import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBookHistoryDto } from './dto/create-book_history.dto';
import { UpdateBookHistoryDto } from './dto/update-book_history.dto';
import { BaseService } from 'src/infrastructure/base/base-service';
import { BookHistoryEntity } from 'src/core/entity/book/book-history-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookHistoryService extends BaseService<
  CreateBookHistoryDto,
  UpdateBookHistoryDto,
  BookHistoryEntity
> {
  constructor(
    @InjectRepository(BookHistoryEntity)
    private readonly bookHistoryRepo: Repository<BookHistoryEntity>,
  ) {
    super(bookHistoryRepo);
  }

  // ------------------------- CREATE -------------------------
  async createBookHistory(createDto: CreateBookHistoryDto) {
    const { action } = createDto;
    const exist = await this.bookHistoryRepo.findOne({ where: { action } as any});
    if (exist) {
      throw new ConflictException(
        `This action => ${action} already exists in BookHistory`,
      );
    }
    return super.create(createDto);
  }

  // ------------------------- UPDATE -------------------------
  async updateBookHistory(id: number, updateDto: UpdateBookHistoryDto) {
    const { action } = updateDto;
    if (action) {
      const exist = await this.bookHistoryRepo.findOne({
        where: { action },
      } as any);
      if (exist && exist.id !== id) {
        throw new ConflictException(
          `This action => ${action} already exists in BookHistory`,
        );
      }
    }
    return super.update(id, updateDto);
  }
}
