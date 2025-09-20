import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { BaseService } from 'src/infrastructure/base/base-service';
import { BorrowEntity } from 'src/core/entity/book/borrow-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/api/user/user/user.service';
import { BookService } from '../book/book.service';
import { config } from 'src/config/env-config';
import { TransactionService } from 'src/infrastructure/transaction/Transaction';
import { successRes } from 'src/infrastructure/success-res/success-res';
import type { IToken } from 'src/infrastructure/token/token-interface';
import { AdminRoles } from 'src/common/enum/Role';

@Injectable()
export class BorrowService extends BaseService<
  CreateBorrowDto,
  UpdateBorrowDto,
  BorrowEntity
> {
  constructor(
    // borrow
    @InjectRepository(BorrowEntity)
    private readonly borrowRepo: Repository<BorrowEntity>,

    // book
    private readonly book: BookService,

    // user
    private readonly user: UserService,

    // transaction
    private readonly transaction: TransactionService,
  ) {
    super(borrowRepo);
  }

  // ------------------------- CREATE -------------------------
  async createBorrow(createDto: CreateBorrowDto) {
    const { user_id, book_id, return_date } = createDto;

    // check id
    const user: any = await this.user.getRepository.findOne({
      where: { id: user_id, borrows: { overdue: false } },
      relations: { borrows: true },
      select: { borrows: true },
    });

    if (user?.borrows?.length > 3) {
      throw new ConflictException(`You could not borrow book max:3`);
    }

    const { data } = await this.book.findOneById(book_id);

    // check date
    if (!data[0].avialable) {
      throw new ConflictException(
        `this book => ${data[0].title} is not avialable`,
      );
    }

    // check date
    const borrow_date = new Date().toISOString().split('T')[0];
    const due_date = this.checkRetrunDate(return_date);

    const result = {
      borrow_date,
      due_date,
      return_date,
      user_id,
      book_id,
    };

    const id = await this.transaction.createTransaction(result);
    if (id) return await this.returnBorrow(id);
    throw new ConflictException(`Error Transaction`);
  }

  // ------------------------- UPDATE -------------------------
  async updateBorrow(id: number, updateDto: UpdateBorrowDto, user: IToken) {
    const { return_date, user_id, book_id, overdue } = updateDto;

    const borrow = await this.borrowRepo.findOne({ where: { id } });
    // check id borrow
    if (!borrow) {
      throw new NotFoundException(`not found this id => ${id} on Book`);
    }
    // check book id
    if (borrow.book_id != book_id || borrow.user_id != user_id) {
      throw new ConflictException(
        `you did not borrow this id => ${book_id} on book`,
      );
    }

    if (borrow.overdue) {
      throw new ConflictException(
        `this book ${borrow?.books?.title ?? borrow?.book_id + '  id'} is already return`,
      );
    }
    let userID = borrow.user_id;
    let bookID = borrow.book_id;

    if (user.role == AdminRoles.SUPERADMIN || user.role == AdminRoles.ADMIN) {
      if (user_id) {
        await this.user.findOneById(user_id);
        await this.borrowRepo.update(id, { user_id });
        userID = user_id;
      }
      if (book_id) {
        await this.book.findOneById(book_id);
        await this.borrowRepo.update(id, { book_id });
        bookID = book_id;
      }
    }

    if (return_date && overdue) {
      // check date
      const borrow_date = new Date().toISOString().split('T')[0];
      const due_date = this.checkRetrunDate(return_date);

      const result = {
        borrow_date,
        due_date,
        return_date,
        user_id: userID,
        book_id: bookID,
        overdue,
      };

      const id = await this.transaction.updateTransaction(result);

      if (id) return await this.returnBorrow(borrow.id);
      throw new ConflictException(`Error Transaction`);
    }
  }

  // ------------------------- CHECK DATE -------------------------
  checkRetrunDate(date: string): string {
    const checkDate = new Date(date).getTime();
    const dueDate =
      new Date().getTime() + Number(config.BORROW_TIME) * 24 * 60 * 60 * 1000;

    const due_date = new Date(dueDate).toISOString().split('T')[0];

    if (checkDate > dueDate) {
      throw new BadRequestException(
        `You max borrow Book ${config.BORROW_TIME}=> Time: ${due_date}`,
      );
    }

    return due_date;
  }
  // ------------------------------ ------------------------------------------
  async returnBorrow(id: number) {
    const { data }: any = await this.findOneBy({
      relations: { user: true, books: true },
      where: { id, is_deleted: false },
      select: {
        id: true,
        borrow_date: true,
        due_date: true,
        return_date: true,
        overdue: true,
        user: {
          id: true,
          email: true,
          full_name: true,
        },
        books: {
          id: true,
          title: true,
          author: true,
          avialable: true,
        },
      },
    });
    return successRes(data);
  }
}
