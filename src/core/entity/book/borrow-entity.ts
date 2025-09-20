import { BaseEntity } from "src/common/database/base-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BookEntity } from "./book-entity";
import { UserEntity } from "../user/user-entity";

@Entity('borrow')
export class BorrowEntity extends BaseEntity {
    // ------------------ BOOK ID ------------------

    @Column({ type: 'int' })
    book_id: number
    // ------------------ USER ID ------------------

    @Column({ type: 'int' })
    user_id: number

    // ------------------ BORROW DATE ------------------

    @Column({ type: 'varchar' })
    borrow_date: string

    // ------------------ DUE DATE ------------------

    @Column({ type: 'varchar' })
    due_date: string

    // ------------------ RETURN DATE ------------------

    @Column({ type: 'varchar' })
    return_date: string

    // ------------------ OVERDUE------------------

    @Column({ type: 'boolean', default: false })
    overdue: boolean
    // ============================= RELEATION =============================

    @ManyToOne(() => BookEntity, (book) => book.borrow, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    books: BookEntity

    @ManyToOne(() => UserEntity, (user) => user.borrows, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity
}