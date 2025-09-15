import { Customer } from './entities/customer.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { successRes } from 'src/utils/successRes';
import { IResponse } from 'src/interface/success-interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerModel: Repository<Customer>,
  ) {}

  // ================================= CREATE ================================= \\
  async create(createDto: CreateCustomerDto): Promise<IResponse> {
    const { email, phone_number } = createDto;

    const existEmail = await this.customerModel.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this email => ${email} already exist on Customer`,
      );
    }

    const existPhone = await this.customerModel.findOne({
      where: { phone_number },
    });
    if (existPhone) {
      throw new ConflictException(
        `this Phone => ${phone_number} already exist on Customer`,
      );
    }

    this.customerModel.create(createDto);
    const result = await this.customerModel.save(createDto);
    return successRes(result);
  }

  // ================================= FIND ALL ================================= \\

  async findAll(): Promise<IResponse> {
    const result = await this.customerModel.find({relations:{orders:true}});
    return successRes(result);
  }

  // ================================= FIND ONE ================================= \\
  async findOne(id: number): Promise<IResponse> {
    const result = await this.customerModel.findOne({ where: { id },relations:{orders:true} });
    if (!result) {
      throw new NotFoundException(`this id => ${id} not found on Customer`);
    }
    return successRes(result);
  }

  async update(id: number, updateDto: UpdateCustomerDto): Promise<IResponse> {
    const { email, phone_number } = updateDto;

    if (email) {
      const existEmail = await this.customerModel.findOne({ where: { email } });
      if (existEmail && existEmail.id != id) {
        throw new ConflictException(
          `this email => ${email} already exist on Customer`,
        );
      }
    }

    if (phone_number) {
      const existPhone = await this.customerModel.findOne({
        where: { phone_number },
      });
      if (existPhone && existPhone.id != id) {
        throw new ConflictException(
          `this Phone => ${phone_number} already exist on Customer`,
        );
      }
    }

    await this.customerModel.update(id, { ...updateDto });
    const result = await this.customerModel.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`this id => ${id} not found on Customer`);
    }
    return successRes(result);
  }

  // ================================= DELETE ================================= \\
  async remove(id: number): Promise<IResponse> {
    const result = await this.customerModel.delete({ id });
    if (result.affected==0) {
      throw new NotFoundException(`this id => ${id} not found on Customer`);
    }
    return successRes({});
  }
}
