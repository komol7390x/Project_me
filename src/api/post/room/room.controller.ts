import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Room' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.roomDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Room' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([PostSawgger.roomAll, PostSawgger.roomAll]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.roomService.findAll({
      relations: {
        showtimes: {
          movies: true,
        },
      },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        is_active: true,
        showtimes: {
          id: true,
          is_active:true,
          movies: {
            id: true,
            title: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Room' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.roomDate))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.roomService.findOneBY({
      relations: {
        showtimes: {
          movies: true,
        },
      },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        location: true,
        total_seats: true,
        is_active: true,
        showtimes: {
          id: true,
          is_active: true,
          movies: {
            id: true,
            title: true || 'not movie',
            description: true,
          },
        },
      },
    });
  }
  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Room' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.roomDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.updateRoom(+id, updateRoomDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Room' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.roomService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Room' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.roomService.remove(+id);
  }
}
