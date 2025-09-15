import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { IResponse } from 'src/interface/success-interface';
import { successRes } from 'src/utils/successRes';
import { Customer } from 'src/modules/users/customer/entities/customer.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderModel: Repository<Order>,
    @InjectRepository(Customer) private readonly customerModel: Repository<Customer>,
    @InjectRepository(Product) private readonly productModel: Repository<Product>
  ) { }

  // ================================= CREATE ================================= \\
  async create(createDto: CreateOrderDto): Promise<IResponse> {

    const { product_id, customer_id, quantity, ...rest } = createDto;

    const customer = await this.customerModel.findOne({ where: { id: customer_id } })
    if (!customer) {
      throw new NotFoundException(`not found this id => ${customer_id} on Customer`)
    }

    const product = await this.productModel.findOne({ where: { id: product_id } })
    if (!product) {
      throw new NotFoundException(`not found this id => ${product_id} on Product`)
    }
    if (product.stock_quantity < quantity) {
      throw new ConflictException(`not quantity this Product: ${product.name}`)
    }
    const price = product.price
    const total_price = price * quantity
    const result = await this.orderModel.save({
      ...rest, quantity, price, total_price,
      customer_id: customer, product_id: product,
    });

    return successRes(result, 201);
  }

  // ================================= FIND ALL ================================= \\
  async findAll(): Promise<IResponse> {
    const result = await this.orderModel.find({
      relations: {
        product_id: true,
        customer_id: true
      },
      order: {
        createdAt: 'DESC'
      }
    });
    return successRes(result);
  }

  // ================================= FIND ONE ================================= \\
  async findOne(id: number): Promise<IResponse> {

    const result = await this.orderModel.findOne({
      where: { id },
      relations: {
        product_id: true,
        customer_id: true
      }
    });
    if (!result) {
      throw new NotFoundException(`not found this id => ${id} on Order`);
    }

    return successRes(result);
  }

  // ================================= UPDATE ================================= \\
  async update(
    id: number,
    updateDto: UpdateOrderDto,
  ): Promise<IResponse> {
    let { product_id, customer_id, ...rest } = updateDto;

    let result = await this.orderModel.findOne({
      where: { id },
      relations: ['customer_id', 'product_id'],
    });

    if (!result) {
      throw new NotFoundException(`not found this id => ${id} on Order`);
    }
    let product: object = result.product_id;
    if (product_id) {
      const check = await this.productModel.findOne({ where: { id: product_id } });
      if (!check) {
        throw new NotFoundException(`not found this id => ${product_id} on Product`);
      }
      product = check
      result.price = check.price
      if(result.quantity>check.stock_quantity){
        throw new ConflictException(`not quantity this Product: ${check.name}`)
      }
      result.total_price = check.price * result.quantity
    }

    let customer = result.customer_id;
    if (customer_id) {
      const check = await this.customerModel.findOne({ where: { id: customer_id } });
      if (!check) {
        throw new NotFoundException(`not found this id => ${customer_id} on Customer`);
      }
      customer = check;
    }

    const updated = this.orderModel.merge(result, {
      ...rest,
      ...result,
      product_id: product,
      customer_id: customer,
    });

    const finish = await this.orderModel.save(updated);
    return successRes(finish);
  }

  // ================================= DELETE ================================= \\
  async remove(id: number): Promise<IResponse> {

    const result = await this.orderModel.delete({ id });
    if (result.affected == 0) {
      throw new NotFoundException(`not found this id => ${id} on Product`);
    }

    return successRes({});
  }
}
