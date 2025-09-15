import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/core/entity/post/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
