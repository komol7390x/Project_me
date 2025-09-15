import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from 'src/core/entity/post/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
