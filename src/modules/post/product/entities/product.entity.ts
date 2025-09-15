import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Saller } from 'src/modules/users/saller/entities/saller.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  price: number;


  @Column({ type: 'int', nullable: false, default: 0 })
  stock_quantity: number;

  @Column({ type: 'varchar', nullable: true })
  image_url: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category_id: Category;

  @ManyToOne(() => Saller, (saller) => saller.products, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  saller_id: Saller;

  @OneToMany(()=>Order,(order)=>order.product_id)
  orders:Order[]

  @CreateDateColumn({select:false})
  createdAt: Date;

  @UpdateDateColumn({select:false})
  updatedAt: Date;
}
