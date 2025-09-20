import { Module } from '@nestjs/common';
import { StatisticaController } from './statistica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookHistoryEntity } from 'src/core/entity/book/book-history-entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookHistoryEntity])],
  controllers: [StatisticaController],
})
export class StatisticaModule {}
