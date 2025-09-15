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
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Movie' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.movieDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.createMovie(createMovieDto);
  }

  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Movie' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([PostSawgger.movieAll, PostSawgger.movieAll]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.movieService.findAll({
      where: {
        is_deleted: false,
      },
      relations: { admin: true, country: true, genre: true, showtimes: true },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        admin: {
          name: true,
          id: true,
          username: true,
          role: true,
        },
        country: {
          id: true,
          name: true,
        },
        genre: {
          id: true,
          name: true,
        },
        showtimes: {
          id: true,
          is_active: true,
          ticket_quantity: true,
          room: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Movie' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.movieDate))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.movieService.findOneBY({
      where: {
        id,
        is_deleted: false,
      },
      relations: { admin: true, genre: true, country: true },
      select: {
        id: true,
        createdAt: true,
        title: true,
        description: true,
        duration: true,
        realase_date: true,
        image_url: true,
        video_url: true,
        language: true,
        admin: {
          name: true,
          id: true,
          username: true,
          role: true,
        },
        country: {
          id: true,
          name: true,
        },
        genre: {
          id: true,
          name: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Movie' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.movieDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.updateMovie(+id, updateMovieDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Movie' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.movieService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Movie' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.movieService.remove(+id);
  }
}
