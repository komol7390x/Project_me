import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreEntity } from 'src/core/entity/post/genre.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [GenreService],
  exports:[GenreService]
})
export class GenreModule {}
