import { IsPhoneNumber } from 'class-validator';
import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomerEntity } from '../users/customer.entity';

@Entity('wallet')
export class WalletEntity extends BaseEntity {
  // --------------------- CARD NAME ---------------------
  @Column({ type: 'varchar' })
  card_name: string;

  // --------------------- CARD NUMBER ---------------------

  @Column({ type: 'varchar', length: 16, unique: true })
  card_number: string;

  // --------------------- CARD BALANCE ---------------------

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  balance: number;

  // -------------------- PHONE NUMBER --------------------

  @Column({ type: 'varchar', length: 20 })
  @IsPhoneNumber('UZ', { message: "Telefon raqami noto'g'ri" })
  phone_number: string;

  // ================================= REALATION =================================

  // --------------------- CUSTOMER ID ---------------------

  @Column({ type: 'int' })
  customer_id: number;

  // --------------------- CUSTOMER RELATION ---------------------
  @ManyToOne(() => CustomerEntity, (customer) => customer.wallets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;
}
