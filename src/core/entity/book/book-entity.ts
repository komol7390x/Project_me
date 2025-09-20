import { BaseEntity } from 'src/common/database/base-entity';
import { AdminRoles } from 'src/common/enum/Role';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BorrowEntity } from './borrow-entity';
import { BookHistoryEntity } from './book-history-entity';

@Entity('book')
export class BookEntity extends BaseEntity {
  // ------------------ TITLE ------------------

  @Column({ type: 'varchar', unique: true })
  title: string;

  // ------------------ AUTHOR ------------------

  @Column({ type: 'varchar' })
  author: string;

  // ------------------ PUBLISHED YEAR ------------------

  @Column({ type: 'varchar' })
  published_year: string;

  // ------------------ AVIALABLE------------------

  @Column({ type: 'boolean', nullable: true, default: false })
  avialable: boolean;

  // ============================= RELEATION =============================

  @OneToMany(() => BorrowEntity, (borrow) => borrow.books, { cascade: true })
  borrow: BorrowEntity[];

  @OneToMany(() => BookHistoryEntity, (borrow) => borrow.books, {
    cascade: true,
  })
  history: BookHistoryEntity[];
}
