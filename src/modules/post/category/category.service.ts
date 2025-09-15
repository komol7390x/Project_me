import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IResponse } from 'src/interface/success-interface';
import { successRes } from 'src/utils/successRes';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly category: Repository<Category>,
  ) {}

  // ================================= CREATE ================================= \\
  async create(createCategoryDto: CreateCategoryDto): Promise<IResponse> {
    const { name } = createCategoryDto;
    const existName = await this.category.findOne({ where: { name } });
    if (existName) {
      throw new ConflictException(`this name => ${name} already exist`);
    }
    const result = await this.category.save(createCategoryDto);
    return successRes(result, 201);
  }

  // ================================= FIND ALL ================================= \\
  async findAll(): Promise<IResponse> {
    const result = await this.category.find({relations:{
      products:true
    }});
    return successRes(result);
  }

  // ================================= FIND ONE ================================= \\
  async findOne(id: number): Promise<IResponse> {
    const result = await this.category.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`not found this id => ${id} on Category`);
    }
    return successRes(result);
  }

  // ================================= UPDATE ================================= \\
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<IResponse> {
    const { name } = updateCategoryDto;
    if (name) {
      const existName = await this.category.findOne({ where: { name } });
      if (existName) {
        throw new ConflictException(`this name => ${name} already exist`);
      }
    }
    await this.category.update(id, updateCategoryDto);
    const result = await this.category.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`not found this id => ${id} on Category`);
    }
    return successRes(result);
  }

  // ================================= DELETE ================================= \\
  async remove(id: number): Promise<IResponse> {
    const result = await this.category.delete({ id });
    if (result.affected == 0) {
      throw new NotFoundException(`not found this id => ${id} on Category`);
    }
    return successRes({});
  }
}
