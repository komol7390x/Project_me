import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowEntity } from 'src/core/entity/book/borrow-entity';
import { UserEntity } from 'src/core/entity/user/user-entity';
import { BookEntity } from 'src/core/entity/book/book-entity';
import { BookService } from '../book/book.service';
import { UserService } from 'src/api/user/user/user.service';
import { RedisService } from 'src/infrastructure/redis/Redis';
import { CryptoService } from 'src/infrastructure/bcrypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { TransactionService } from 'src/infrastructure/transaction/Transaction';
import { BookHistoryEntity } from 'src/core/entity/book/book-history-entity';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowEntity, UserEntity, BookEntity, BookHistoryEntity])],
  controllers: [BorrowController],
  providers: [
    BorrowService,
    BookService,
    UserService,
    RedisService,
    CryptoService,
    TokenService,
    TransactionService,
  ],
  exports: [TransactionService],
})
export class BorrowModule {}
