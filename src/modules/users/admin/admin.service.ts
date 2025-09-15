import { Admin } from './entities/admin.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { successRes } from 'src/utils/successRes';
import { IResponse } from 'src/interface/success-interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminModel: Repository<Admin>,
  ) {}

  // ================================= CREATE ================================= \\
  async create(createAdminDto: CreateAdminDto): Promise<IResponse> {
    const { email, phone_number } = createAdminDto;
    
    const existEmail = await this.adminModel.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this email => ${email} already exist on Admin`,
      );
    }

    const existPhone = await this.adminModel.findOne({ where: { phone_number } });
    if (existPhone) {
      throw new ConflictException(`this Phone => ${phone_number} already exist on Admin`,);
    }

    const result = await this.adminModel.save(createAdminDto);
    return successRes(result);
  }

  // ================================= FIND ALL ================================= \\

  async findAll(): Promise<IResponse> {
    const result = await this.adminModel.find();
    return successRes(result);
  }
  
  // ================================= FIND ONE ================================= \\
  async findOne(id: number): Promise<IResponse> {
    const result = await this.adminModel.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`this id => ${id} not found on Admin`);
    }
    return successRes(result);
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<IResponse> {
    const { email, phone_number } = updateAdminDto;

    if (email) {
        const existEmail = await this.adminModel.findOne({ where: { email } });
        if (existEmail && existEmail.id != id) {
          throw new ConflictException(`this email => ${email} already exist on Admin`,);
        }
    }

    if (phone_number) {
        const existPhone = await this.adminModel.findOne({ where: { phone_number } });
        if (existPhone && existPhone.id!=id) {
          throw new ConflictException(`this Phone => ${phone_number} already exist on Admin`,);
        }
    }

    await this.adminModel.update(id, { ...updateAdminDto });
    const result = await this.adminModel.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`this id => ${id} not found on Admin`);
    }
    return successRes(result);
  }

  // ================================= DELETE ================================= \\
  async remove(id: number): Promise<IResponse> {
    const result = await this.adminModel.delete({ id });
    console.log(result);
    
    if (result.affected==0) {
      throw new NotFoundException(`this id => ${id} not found on Admin`);
    }
    return successRes({});
  }
}
