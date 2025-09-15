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
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostSawgger } from 'src/common/document/swagger.post';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Country' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.countryDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.createCountry(createCountryDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Country' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([
      PostSawgger.countryAll,
      PostSawgger.countryAll,
    ]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.countryService.findAll({
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
  @ApiOperation({ summary: 'Get One Country' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.countryDate))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.countryService.findOneBY({
      relations: { movies: true },
      where: {
        id,
        is_deleted: false,
      },
      select: {
        createdAt: true,
        updatedAt: true,
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
  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Country' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.countryDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.updateCountry(+id, updateCountryDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Country' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.countryService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Country' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.countryService.remove(+id);
  }
}
