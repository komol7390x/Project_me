import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/common/enum/action';
import { BookEntity } from 'src/core/entity/book/book-entity';
import { BookHistoryEntity } from 'src/core/entity/book/book-history-entity';
import { BorrowEntity } from 'src/core/entity/book/borrow-entity';
import { Repository, DataSource } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { successRes } from '../success-res/success-res';

@Injectable()
export class TransactionService {
  constructor(
    // history
    @InjectRepository(BookHistoryEntity)
    private readonly bookHistory: Repository<BookHistoryEntity>,

    // book
    @InjectRepository(BookEntity)
    private readonly book: Repository<BookEntity>,

    //
    @InjectRepository(BorrowEntity)
    private readonly borrow: Repository<BorrowEntity>,
  ) {}
  // ------------------------------ CREATE ------------------------------
  @Transactional()
  async createTransaction(data: {
    borrow_date: string;
    due_date: string;
    return_date: string;
    user_id: number;
    book_id: number;
  }) {
    const { user_id, book_id, borrow_date } = data;
    const history = {
      date: borrow_date,
      user_id,
      book_id,
      action: Action.BORROW,
    };

    // update book
    await this.book.update({ id: data.book_id }, { avialable: false });

    // save history save
    await this.bookHistory.save(history);
    const result = await this.borrow.save(data);
    if (result) {
      return Number(result.id);
    }
    return null;
  }
  // ------------------------------ UPDATE ------------------------------

  @Transactional()
  async updateTransaction(data: {
    borrow_date: string;
    due_date: string;
    return_date: string;
    user_id: number;
    book_id: number;
    overdue: boolean;
  }) {
    
    const { user_id, book_id, borrow_date, overdue } = data;
    let history = {
      date: borrow_date,
      user_id,
      book_id,
      action: Action.BORROW,
    };
    const historyId = await this.bookHistory.findOne({
      where: { user_id, book_id },
    });

    // if overdue is true
    if (overdue) {
      history = {
        date: borrow_date,
        user_id,
        book_id,
        action: Action.RETURN,
      };
      await this.book.update({ id: data.book_id }, { avialable: true });
      await this.bookHistory.update({ id: historyId?.id }, { ...history });
    }

    // borrow update
    const borrowId = await this.borrow.findOne({
      where: { user_id, book_id },
    });

    // borrow update
    const result = await this.borrow.update({ id: borrowId?.id }, { ...data });

    if (result.affected == 1 || result) {
      return true;
    }
  }
}
