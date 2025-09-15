import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  // ----------------- ID -----------------
  @PrimaryGeneratedColumn()
  id: number;

  // ----------------- CREATED AT -----------------
  @CreateDateColumn()
  createdAt: Date;

  // ----------------- UPDATE AT -----------------
  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------- IS DELETED -----------------
  @Column({ type: 'boolean', nullable: true, default: false })
  is_deleted?: boolean
}

