import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';

@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Showtime' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.showtimeDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.createShowtime(createShowtimeDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Showtime' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([
      PostSawgger.showtimeAll,
      PostSawgger.showtimeAll,
    ]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.showtimeService.findAll({
      relations: {
        room: true,
        movies: true,
      },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        ticket_quantity: true,
        is_active: true,
        room: {
          id: true,
          name: true,
          location: true,
          is_active: true,
        },
        movies: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Showtime' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.showtimeDate))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.showtimeService.findOneBY({
      relations: {
        room: true,
        movies: true,
        tickets: true,
      },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        ticket_quantity: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
        room: {
          id: true,
          name: true,
          location: true,
          is_active: true,
        },
        movies: {
          id: true,
          title: true,
          createdAt: true,
        },
        tickets: {
          id: true,
          price: true,
          status: true,
          start_time: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Showtime' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.showtimeDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @Param('id') id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimeService.updateShowtime(+id, updateShowtimeDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Showtime' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.showtimeService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Showtime' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.showtimeService.remove(+id);
  }
}
