import { Customer } from "src/modules/users/customer/entities/customer.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'int' })
    price: number

    @Column({ type: 'int' })
    total_price: number

    @ManyToOne(() => Customer, (customer) => customer.orders,{
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    customer_id: Customer;

    @ManyToOne(() => Product, (product) => product.orders, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    product_id: Product;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
