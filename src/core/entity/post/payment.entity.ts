import { BaseEntity } from 'src/common/database/base.entity';
import { Payment } from 'src/common/enum/payment';
import { Column, Entity } from 'typeorm';

@Entity('payment')
export class PaymentEntity extends BaseEntity {
  @Column({ type: 'decimal' })
  total_price: number;

  @Column({
    type: 'enum',
    enum: Payment,
    default: Payment.PENDING,
    nullable: true,
  })
  status: boolean;

  @Column({ type: 'int' })
  order_id: number;
}
