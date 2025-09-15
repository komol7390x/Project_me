import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/database/base.entity';
import { ShowtimeEntity } from './showtime.entity';

@Entity('room')
export class RoomEntity extends BaseEntity {
  // ------------------------- NAME -------------------------

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  // ------------------------- LOACTION -------------------------

  @Column({ type: 'varchar', length: 200 })
  location: string;

  // ------------------------- TOTAL SEATS -------------------------

  @Column({ type: 'int' })
  total_seats: number;

  // ------------------------- IS ACTIVE -------------------------

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
  
  // ================================= REALATION =================================

  // ---------------------------- SHOW TIME RELATION ----------------------------

  @OneToMany(() => ShowtimeEntity, (showtime) => showtime.room, {
    cascade: true,
  })
  showtimes: ShowtimeEntity[];
}
