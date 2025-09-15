import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { RoomEntity } from 'src/core/entity/post/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService extends BaseService<
  CreateRoomDto,
  UpdateRoomDto,
  RoomEntity
> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepo: Repository<RoomEntity>,
  ) {
    super(roomRepo);
  }
  // ============================ CREATE ROOM ============================

  async createRoom(createRoomDto: CreateRoomDto) {
    const { name } = createRoomDto;

    // check exist name
    const existName = await this.roomRepo.findOne({ where: { name } });

    // check is_deleted
    if (!existName?.is_deleted) {
      if (existName) {
        throw new ConflictException(
          `this name => ${name} alreaady exist on Room`,
        );
      }
    } else {
      await this.remove(existName.id);
    }

    // create
    return super.create(createRoomDto);
  }

  // ============================ UPDATE ROOM ============================
  async updateRoom(id: number, updateRoomDto: UpdateRoomDto) {
    const { name } = updateRoomDto;

    // check exist name
    if (name) {
      const existName = await this.roomRepo.findOne({ where: { name } });
      if (!existName?.is_deleted) {
        if (existName) {
          throw new ConflictException(
            `this name => ${name} alreaady exist on Room`,
          );
        }
      } else {
        await this.remove(existName.id);
      }
    }

    // update
    return super.update(id, updateRoomDto);
  }
}
