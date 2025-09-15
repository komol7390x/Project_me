import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { CustomerEntity } from '../users/customer.entity';
import { TicketEntity } from './ticket.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'varchar' })
  customer_id: string;

  @Column({ type: 'varchar' })
  movie_id: string;

  // ================================= REALATION =================================

  // ---------------------------- CUSTOMER ----------------------------
  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  // ---------------------------- TICKET RELATION ----------------------------

  @ManyToOne(() => TicketEntity, (ticket) => ticket.orders, { eager: true })
  @JoinColumn({ name: 'movie_id' })
  ticket: TicketEntity;
}
