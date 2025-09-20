import { BaseEntity } from 'src/common/database/base-entity';
import { UserRoles } from 'src/common/enum/Role';
import { Column, Entity, OneToMany } from 'typeorm';
import { BorrowEntity } from '../book/borrow-entity';
import { BookEntity } from '../book/book-entity';
import { BookHistoryEntity } from '../book/book-history-entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  // ------------------ FULL NAME ------------------

  @Column({ type: 'varchar' })
  full_name: string;

  // ------------------ EMAIL ------------------

  @Column({ type: 'varchar', unique: true })
  email: string;

  // ------------------ PASSWORD ------------------

  @Column({ type: 'varchar' })
  hashed_password: string;

  // ------------------ ROLE ------------------

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.READER })
  role: UserRoles;

  // ------------------ IS ACTIVE ------------------

  @Column({ type: 'boolean', nullable: true, default: true })
  is_active: boolean;

  // ------------------ BORROW RELEATION ------------------
  @OneToMany(() => BorrowEntity, (borrow) => borrow.user, { cascade: true })
  borrows: BorrowEntity[];

  // ------------------ BOOK RELEATION ------------------
  @OneToMany(() => BookHistoryEntity, (borrow) => borrow.user, {
    cascade: true,
  })
  history: BookHistoryEntity[];
}
