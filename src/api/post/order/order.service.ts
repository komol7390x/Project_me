import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from 'src/core/entity/post/order.entity';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';
import { TicketEntity } from 'src/core/entity/post/ticket.entity';
import { MovieEntity } from 'src/core/entity/post/movie.entity';

@Injectable()
export class OrderService extends BaseService<
  CreateOrderDto,
  UpdateOrderDto,
  OrderEntity
> {
  constructor(
    // order
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    // customer
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,

    // customer
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,

    // ticket
    @InjectRepository(TicketEntity)
    private readonly ticketRepo: Repository<TicketEntity>,
  ) {
    super(orderRepo);
  }

  // ============================ CREATE ORDER ============================

  async createOrder(createOrderDto: CreateOrderDto) {
    // distructure
    const { movie_id, customer_id, quantity, ...rest } = createOrderDto;

    // check customer id
    await this.findByIdRepository(this.customerRepo, customer_id);

    // check ticket id

    const movie: any = await this.movieRepo.findOne({
      where: { id: movie_id },
      relations: { showtimes: { tickets: true } },
    });
    if (!movie) {
      throw new NotFoundException(
        `this movie  id => ${movie_id} not found on Movie`,
      );
    }
    const price = Number(movie?.showtimes[0]?.tickets.at(-1)?.price);

    if (isNaN(price)) {
      throw new ConflictException('error price');
    }

    // // add total price
    const total_price = Number(quantity) * price;

    const result = { ...rest, total_price, customer_id, movie_id, quantity };

    // // create
    return super.create(result);
  }

  // ============================ UPDATE ORDER ============================

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    // distructure
    const { customer_id, movie_id, quantity } = updateOrderDto;

    // check customer id
    if (customer_id) {
      await this.findByIdRepository(this.customerRepo, customer_id);
    }

    // check ticket id
    if (movie_id) {
      await this.findByIdRepository(this.ticketRepo, movie_id);
    }

    // update
    return super.update(id, updateOrderDto);
  }
}
