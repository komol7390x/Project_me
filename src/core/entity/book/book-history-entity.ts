import { BaseEntity } from 'src/common/database/base-entity';
import { Action } from 'src/common/enum/action';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user-entity';
import { BookEntity } from './book-entity';

@Entity('book-history')
export class BookHistoryEntity extends BaseEntity {
  // ------------------ TITLE ------------------

  @Column({ type: 'enum', enum: Action, nullable: false })
  action: Action;

  // ------------------ USER ID ------------------

  @Column({ type: 'int', nullable: false })
  user_id: number;

  // ------------------ BOOK ID ------------------

  @Column({ type: 'int', nullable: false })
  book_id: number;

  // ------------------ DATE ------------------

  @Column({ type: 'varchar', nullable: false })
  date: string;

  // ============================ RELEATION ============================

  @ManyToOne(() => UserEntity, (user) => user.history, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.history, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  books: BookEntity;
}
