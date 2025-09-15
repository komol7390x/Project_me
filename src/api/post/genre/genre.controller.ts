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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Genre' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.genreDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.createGenre(createGenreDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Genre' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([PostSawgger.genreAll, PostSawgger.genreAll]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.genreService.findAll({
      relations: { movies: true },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        movies: {
          createdAt: true,
          image_url: true,
          video_url: true,
          id: true,
          title: true,
          duration: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Genre' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.genreDate))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.genreService.findOneBY({
      relations: { movies: true },
      where: {
        id,
        is_deleted: false,
      },
      select: {
        id: true,
        name: true,
        movies: {
          id: true,
          title: true,
          image_url: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Genre' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.genreDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.updateGenre(+id, updateGenreDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete genre' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.genreService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Genre' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.genreService.remove(+id);
  }
}
