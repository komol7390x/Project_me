import { Module } from '@nestjs/common';
import { BookHistoryService } from './book_history.service';
import { BookHistoryController } from './book_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookHistoryEntity } from 'src/core/entity/book/book-history-entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookHistoryEntity])],
  controllers: [BookHistoryController],
  providers: [BookHistoryService],
})
export class BookHistoryModule {}
