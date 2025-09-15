import { Product } from 'src/modules/post/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('saller')
export class Saller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 13, nullable: true })
  phone_number: string;

  @Column({ type: 'int', default: 0 })
  balance: number;


 @OneToMany(() => Product, (product) => product.saller_id)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
