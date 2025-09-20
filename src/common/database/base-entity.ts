import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {

    // ------------------ ID ------------------

    @PrimaryGeneratedColumn()
    id: number

    // ------------------ IS DELETED ------------------

    @Column({ type: 'boolean', nullable: true, default: false })
    is_deleted: boolean

    // ------------------ CREATED AT ------------------

    @CreateDateColumn()
    createdAt: Date

    // ------------------ UPDATED AT ------------------

    @UpdateDateColumn()
    updatedAt: Date

}