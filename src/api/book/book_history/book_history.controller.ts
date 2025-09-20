import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BookHistoryService } from './book_history.service';
import { CreateBookHistoryDto } from './dto/create-book_history.dto';
import { UpdateBookHistoryDto } from './dto/update-book_history.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/common/swagger/swagger-response';
import { SwaggerDate } from 'src/infrastructure/document/swagger-data';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { RolesGuard } from 'src/common/guard/role-guard';
import { AdminRoles, UserRoles } from 'src/common/enum/Role';
import { AccessRoles } from 'src/common/decorator/roles-decorator';

@Controller('book-history')
export class BookHistoryController {
  constructor(private readonly bookHistoryRepo: BookHistoryService) {}

  // ------------------ GET ALL ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Get All Book Histories' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse([
      SwaggerDate.BookhistoryDate,
      SwaggerDate.BookhistoryDate,
    ]),
  )

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)

  // ENDPOINT
  @Get()
  @ApiBearerAuth()

  // FIND ALL
  findAll() {
    return this.bookHistoryRepo.findAll({
      where: { is_deleted: false },
      relations: { user: true, books: true },
      select: {
        id: true,
        action: true,
        date: true,
        user: {
          id: true,
          email: true,
        },
        books: {
          id: true,
          title: true,
          avialable: true,
        },
      },
      order: { updatedAt: 'DESC' },
    });
  }

  // ------------------ GET ONE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Get One Book History' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.BookhistoryDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(
    AdminRoles.SUPERADMIN,
    AdminRoles.ADMIN,
    UserRoles.LIBRARIAN,
    UserRoles.READER,
  )

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  findOne(@Param('id') id: number) {
    return this.bookHistoryRepo.findOneById(+id, {
      where: { is_deleted: false },
      relations: { user: true, books: true },
      select: {
        id: true,
        action: true,
        date: true,
        user: {
          id: true,
          email: true,
        },
        books: {
          id: true,
          title: true,
          avialable: true,
        },
      },
      order: { updatedAt: 'DESC' },
    });
  }

  // ------------------ UPDATE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Update Book History' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.BookhistoryDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @Param('id') id: number,
    @Body() updateBookHistoryDto: UpdateBookHistoryDto,
  ) {
    return this.bookHistoryRepo.updateBookHistory(+id, updateBookHistoryDto);
  }

  // ------------------ SOFT DELETE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Book History' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.BookhistoryDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Patch(':id/soft')
  @ApiBearerAuth()

  // SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.bookHistoryRepo.softDelete(+id);
  }

  // ------------------ DELETE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Delete Book History' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.BookhistoryDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  // DELETE
  remove(@Param('id') id: number) {
    return this.bookHistoryRepo.remove(+id);
  }
}
