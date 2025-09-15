import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { RoomEntity } from './room.entity';
import { TicketEntity } from './ticket.entity';

@Entity('showtime')
export class ShowtimeEntity extends BaseEntity {
  // -------------------- MOVIE ID --------------------

  @Column({ type: 'int' })
  movie_id: number;

  // -------------------- STOCK QUANTITY --------------------

  @Column({ type: 'int' })
  ticket_quantity: number;

  // -------------------- ROOM ID --------------------

  @Column({ type: 'int' })
  room_id: number;

  // -------------------- IS ACTIVE --------------------

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  // -------------------- SEAT QUANTITY --------------------

  @Column({ type: 'int' })
  seat_qantity: number;

  // ================================= REALATION =================================

  // -------------------- ROOM REALATION --------------------
  @ManyToOne(() => RoomEntity, (room) => room.showtimes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity[];

  // -------------------- MOVIE REALATION --------------------

  @ManyToOne(() => MovieEntity, (movie) => movie.showtimes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movies: MovieEntity[];

  // -------------------- TICKET REALATION --------------------

  @OneToMany(() => TicketEntity, (ticket) => ticket.showtime, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tickets: TicketEntity[];
}
