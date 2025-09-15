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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';
import { PostSawgger } from 'src/common/document/swagger.post';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Review' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.reviewDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Review' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([
      PostSawgger.reviewAll,
      PostSawgger.reviewAll,
    ]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.reviewService.findAll({
      relations: {
        customer: true,
        movie: true,
      },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        customer: {
          id: true,
          name: true,
          email: true,
        },
        movie: {
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
  @ApiOperation({ summary: 'Get One Review' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.reviewDate))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.reviewService.findOneBY({
      relations: {
        customer: true,
        movie: true,
      },
      where: {
        id,
        is_deleted: false,
      },
      select: {
        createdAt: true,
        updatedAt: true,
        id: true,
        rating: true,
        comment: true,
        customer: {
          id: true,
          name: true,
          email: true,
        },
        movie: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Review' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.reviewDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.updateReview(+id, updateReviewDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Review' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.reviewService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Review' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.reviewService.remove(+id);
  }
}
