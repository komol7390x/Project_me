import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/core/entity/book/book-entity';

@Module({
  imports:[TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  providers: [BookService],
  exports:[BookService]
})
export class BookModule {}
