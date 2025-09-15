import { BaseEntity } from 'src/common/database/base.entity';
import { Roles } from 'src/common/enum/Roles';
import { Column, Entity, OneToMany } from 'typeorm';
import { MovieEntity } from '../post/movie.entity';

@Entity('admin')
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  hashed_password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.ADMIN })
  role: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @OneToMany(() => MovieEntity, (movie) => movie.admin, {
    cascade: true,
  })
  movies: MovieEntity[];
}
