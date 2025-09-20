import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookHistoryEntity } from 'src/core/entity/book/book-history-entity';
import { ISuccessRes } from 'src/infrastructure/success-res/success-interface';
import { successRes } from 'src/infrastructure/success-res/success-res';
import { Repository } from 'typeorm';

@Controller('stats')
export class StatisticaController {
  constructor(
    @InjectRepository(BookHistoryEntity)
    private readonly history: Repository<BookHistoryEntity>,
  ) {}
  // --------------------- TOP BOOKS ---------------------
  @Get('top-user')
  async topUser(): Promise<ISuccessRes> {
    const result = await this.history
      .createQueryBuilder('history')
      .innerJoin('history.user', 'user')
      .where('user.role = :role', { role: 'READER' })
      .select([
        'user.id AS user_id',
        'user.email AS email',
        'COUNT(history.id) AS total_borrows',
      ])
      .groupBy('user.id')
      .addGroupBy('user.email')
      .orderBy('total_borrows', 'DESC')
      .limit(1)
      .getRawOne();

    return successRes(result);
  }

  // --------------------- TOP USER ---------------------

  @Get('top-book')
  async topBook(): Promise<ISuccessRes> {
    const result = await this.history
      .createQueryBuilder('history')
      .innerJoin('history.books', 'book')
      .select('book.id', 'book_id')
      .addSelect('book.title', 'title')
      .addSelect('COUNT(history.id)', 'total_borrows')
      .groupBy('book.id, book.title')
      .orderBy('total_borrows', 'DESC')
      .getRawOne();

    return successRes(result);
  }
}
