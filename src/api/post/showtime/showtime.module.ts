import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeEntity } from 'src/core/entity/post/showtime.entity';
import { MovieEntity } from 'src/core/entity/post/movie.entity';
import { RoomEntity } from 'src/core/entity/post/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShowtimeEntity, MovieEntity, RoomEntity]),
  ],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
  exports: [ShowtimeService],
})
export class ShowtimeModule {}
