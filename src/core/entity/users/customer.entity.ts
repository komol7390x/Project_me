import { BaseEntity } from 'src/common/database/base.entity';
import { Roles } from 'src/common/enum/Roles';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderEntity } from '../post/order.entity';
import { ReviewEntity } from '../post/review.entity';
import { IsPhoneNumber } from 'class-validator';
import { WalletEntity } from '../post/wallet.entity';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  // -------------------- NAME --------------------

  @Column({ type: 'varchar' })
  name: string;

  // -------------------- EMAIL --------------------

  @Column({ type: 'varchar', unique: true })
  email: string;

  // -------------------- HASHD PASSWORD --------------------

  @Column({ type: 'varchar' })
  hashed_password: string;

  // -------------------- ROLE --------------------

  @Column({ type: 'enum', enum: Roles, default: Roles.CUSTOMER })
  role: string;

  // -------------------- IS ACTIVE --------------------

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  // -------------------- PHONE NUMBER --------------------

  @Column({ type: 'varchar', length: 20, unique: true })
  @IsPhoneNumber('UZ', { message: "Telefon raqami noto'g'ri" })
  phone_number: string;

  // -------------------- BALANCE --------------------

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  balance: number;

  // -------------------- ORDER RELATION --------------------

  @OneToMany(() => OrderEntity, (order) => order.customer, {
    cascade: true,
  })
  orders: OrderEntity[];

  // -------------------- REVIEW RELATION --------------------

  @OneToMany(() => ReviewEntity, (review) => review.customer, {
    cascade: true,
  })
  reviews: ReviewEntity[];

  @OneToMany(() => WalletEntity, (wallet) => wallet.customer, {
    cascade: true,
  })
  wallets: WalletEntity[];
}
