import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CountryEntity } from 'src/core/entity/post/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService extends BaseService<
  CreateCountryDto,
  UpdateCountryDto,
  CountryEntity
> {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepo: Repository<CountryEntity>,
  ) {
    super(countryRepo);
  }

  // ============================ CREATE COUNTRY ============================

  async createCountry(CreateCountryDto: CreateCountryDto) {
    const { name } = CreateCountryDto;

    // check exist name
    const existName = await this.countryRepo.findOne({ where: { name } });

    // check is_deleted
    if (!existName?.is_deleted) {
      if (existName) {
        throw new ConflictException(
          `this name => ${name} alreaady exist on Country`,
        );
      }
    } else {
      await this.remove(existName.id);
    }

    // create
    return super.create(CreateCountryDto);
  }

  // ============================ UPDATE COUNTRY ============================

  async updateCountry(id: number, UpdateCountryDto: UpdateCountryDto) {
    const { name } = UpdateCountryDto;

    // check exist name
    if (name) {
      const existName = await this.countryRepo.findOne({ where: { name } });
       if (!existName?.is_deleted) {
         if (existName) {
           throw new ConflictException(
             `this name => ${name} alreaady exist on Country`,
           );
         }
       } else {
         await this.remove(existName.id);
       }
    }

    // update
    return super.update(id, UpdateCountryDto);
  }
}
