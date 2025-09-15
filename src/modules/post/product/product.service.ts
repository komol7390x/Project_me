import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { IResponse } from 'src/interface/success-interface';
import { successRes } from 'src/utils/successRes';
import { Saller } from 'src/modules/users/saller/entities/saller.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly product: Repository<Product>,
    @InjectRepository(Saller) private readonly sallerModel: Repository<Saller>,
    @InjectRepository(Category) private readonly categoryModel: Repository<Category>
  ) { }

  // ================================= CREATE ================================= \\
  async create(createDto: CreateProductDto): Promise<IResponse> {

    const { name, category_id, saller_id, ...rest } = createDto;
    const existName = await this.product.findOne({ where: { name } });

    if (existName) {
      throw new ConflictException(`this name => ${name} already exist on Product`);
    }

    const saller = await this.sallerModel.findOne({ where: { id: saller_id } })
    if (!saller) {
      throw new NotFoundException(`not found this id => ${saller_id} on Saller`)
    }

    const category = await this.categoryModel.findOne({ where: { id: category_id } })
    if (!category) {
      throw new NotFoundException(`not found this id => ${category_id} on Category`)
    }

    const result = await this.product.save({ ...rest, name, saller_id: saller, category_id: category, });
    return successRes(result, 201);
  }

  // ================================= FIND ALL ================================= \\
  async findAll(): Promise<IResponse> {
    const result = await this.product.find({
      relations: {
        category_id: true,
        saller_id: true
      },
      order: {
        createdAt: 'DESC'
      }
    });
    return successRes(result);
  }

  // ================================= FIND ONE ================================= \\
  async findOne(id: number): Promise<IResponse> {

    const result = await this.product.findOne({
      where: { id },
      relations: {
        category_id: true,
        saller_id: true
      }
    });
    if (!result) {
      throw new NotFoundException(`not found this id => ${id} on Product`);
    }

    return successRes(result);
  }

  // ================================= UPDATE ================================= \\
  async update(
    id: number,
    updateDto: UpdateProductDto,
  ): Promise<IResponse> {
    const { name, category_id, saller_id, ...rest } = updateDto;

    const result = await this.product.findOne({
      where: { id },
      relations: ['saller_id', 'category_id'],
    });

    if (!result) {
      throw new NotFoundException(`not found this id => ${id} on Product`);
    }

    if (name) {
      const existName = await this.product.findOne({ where: { name } });
      if (existName && existName.id !== id) {
        throw new ConflictException(`this name => ${name} already exist`);
      }
    }

    let saller = result.saller_id;
    if (saller_id) {
      const check = await this.sallerModel.findOne({ where: { id: saller_id } });
      if (!check) {
        throw new NotFoundException(`not found this id => ${saller_id} on Saller`);
      }
      saller = check;
    }

    let category = result.category_id;
    if (category_id) {
      const check = await this.categoryModel.findOne({ where: { id: category_id } });
      if (!check) {
        throw new NotFoundException(`not found this id => ${category_id} on Category`);
      }
      category = check;
    }

    const updated = this.product.merge(result, {
      ...rest,
      name,
      saller_id: saller,
      category_id: category,
    });

    const finish = await this.product.save(updated);
    return successRes(finish);
  }


  // ================================= DELETE ================================= \\
  async remove(id: number): Promise<IResponse> {

    const result = await this.product.delete({ id });
    if (result.affected == 0) {
      throw new NotFoundException(`not found this id => ${id} on Product`);
    }

    return successRes({});
  }
}
