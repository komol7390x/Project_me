import { Saller } from './entities/saller.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSallerDto } from './dto/create-saller.dto';
import { UpdateSallerDto } from './dto/update-saller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { successRes } from 'src/utils/successRes';
import { IResponse } from 'src/interface/success-interface';

@Injectable()
export class SallerService {
  constructor(
    @InjectRepository(Saller)
    private readonly sallerModel: Repository<Saller>,
  ) {}

  // ================================= CREATE ================================= \\
  async create(createDto: CreateSallerDto): Promise<IResponse> {
    const { email, phone_number } = createDto;

    const existEmail = await this.sallerModel.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this email => ${email} already exist on Customer`,
      );
    }

    const existPhone = await this.sallerModel.findOne({
      where: { phone_number },
    });
    if (existPhone) {
      throw new ConflictException(
        `this Phone => ${phone_number} already exist on Customer`,
      );
    }

    this.sallerModel.create(createDto);
    const result = await this.sallerModel.save(createDto);
    return successRes(result);
  }

  // ================================= FIND ALL ================================= \\

  async findAll(): Promise<IResponse> {
    const result = await this.sallerModel.find({relations:{products:true},order:{createdAt:'DESC'}});
    return successRes(result);
  }

  // ================================= FIND ONE ================================= \\
  async findOne(id: number): Promise<IResponse> {
    const result = await this.sallerModel.findOne({ where: { id},relations:{products:true} });
    if (!result) {
      throw new NotFoundException(`this id => ${id} not found on Customer`);
    }
    return successRes(result);
  }

  async update(id: number, updateDto: UpdateSallerDto): Promise<IResponse> {
    const { email, phone_number } = updateDto;

    if (email) {
      const existEmail = await this.sallerModel.findOne({ where: { email } });
      if (existEmail && existEmail.id != id) {
        throw new ConflictException(
          `this email => ${email} already exist on Customer`,
        );
      }
    }

    if (phone_number) {
      const existPhone = await this.sallerModel.findOne({
        where: { phone_number },
      });
      if (existPhone && existPhone.id != id) {
        throw new ConflictException(
          `this Phone => ${phone_number} already exist on Customer`,
        );
      }
    }

    await this.sallerModel.update(id, { ...updateDto });
    const result = await this.sallerModel.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`this id => ${id} not found on Customer`);
    }
    return successRes(result);
  }

  // ================================= DELETE ================================= \\
  async remove(id: number): Promise<IResponse> {
    const result = await this.sallerModel.delete({ id });
    if (result.affected==0) {
      throw new NotFoundException(`this id => ${id} not found on Customer`);
    }
    return successRes({});
  }
}
