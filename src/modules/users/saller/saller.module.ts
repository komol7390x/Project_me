import { Module } from '@nestjs/common';
import { SallerService } from './saller.service';
import { SallerController } from './saller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saller } from './entities/saller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saller])],
  controllers: [SallerController],
  providers: [SallerService],
})
export class SallerModule {}
