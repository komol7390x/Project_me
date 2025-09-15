import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { OrderEntity } from './order.entity';
import { ShowtimeEntity } from './showtime.entity';

@Entity('ticket')
export class TicketEntity extends BaseEntity {
  // -------------------- SEAT NUMBER --------------------

  @Column()
  seat_number: number;
  // -------------------- PRICE --------------------

  @Column({ type: 'decimal' })
  price: number;

  // -------------------- SHOWTIME ID --------------------

  @Column({ type: 'int' })
  showtime_id: number;

  // -------------------- STATUS --------------------

  @Column({ type: 'boolean', default: true })
  status: boolean;
  // -------------------- START TIME --------------------

  @Column({ type: 'varchar' })
  start_time: string;

  // -------------------- END TIME --------------------

  @Column({ type: 'varchar' })
  end_time: string;

  // ================================= REALATION =================================

  // -------------------- SHOWTIME REALATION --------------------

  @ManyToOne(() => ShowtimeEntity, (showtime) => showtime.tickets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'showtime_id' })
  showtime: ShowtimeEntity;

  // -------------------- ORDER REALATION --------------------

  @OneToMany(() => OrderEntity, (order) => order.ticket)
  orders: OrderEntity[];
}
