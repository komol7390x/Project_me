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
  ConflictException,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/common/swagger/swagger-response';
import { SwaggerDate } from 'src/infrastructure/document/swagger-data';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { RolesGuard } from 'src/common/guard/role-guard';
import { AdminRoles, UserRoles } from 'src/common/enum/Role';
import { AccessRoles } from 'src/common/decorator/roles-decorator';
import { GetUser } from 'src/common/decorator/get-request';
import type { IToken } from 'src/infrastructure/token/token-interface';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) { }

  // ------------------ CREATE ------------------
  //SWAGGER
  @ApiOperation({ summary: 'Create Borrow' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      SwaggerDate.borrowDate,
      HttpStatus.CREATED,
      'Borrow created',
    ),
  )
  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.READER)

  //ENDPONT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(
    @Body() createBorrowDto: CreateBorrowDto,
    @GetUser('user') user: IToken,
  ) {
    const { user_id } = createBorrowDto;
    if (
      user.id == user_id ||
      user.role == AdminRoles.SUPERADMIN ||
      user.role == AdminRoles.ADMIN
    ) {
      return this.borrowService.createBorrow(createBorrowDto);
    } else {
      throw new ConflictException(`You areant create this borrow`);
    }
  }

  // ------------------ GET ALL ------------------
  //SWAGGER
  @ApiOperation({ summary: 'Get All Borrows' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse([
      SwaggerDate.borrowDate,
      SwaggerDate.borrowDate,
    ]),
  )

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)

  //ENDPONT
  @Get()
  @ApiBearerAuth()

  //FINDALL
  findAll() {
    return this.borrowService.findAll({
      relations: { books: true, user: true },
      where: { is_deleted: false },
      select: {
        borrow_date: true,
        due_date: true,
        overdue: true,
        books: { id: true, title: true },
        user: { id: true, email: true, full_name: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ------------------ GET ONE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Get One Borrow' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.borrowDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN,UserRoles.READER)

  // ENDPONT
  @Get(':id')
  @ApiBearerAuth()
  // GET ONE
  async findOne(@Param('id') id: number, @GetUser('user') user: IToken) {    
    //check user id
    const { data } = await this.borrowService.findOneById(id);
    if (
      data[0].user_id == user.id ||
      user.role == AdminRoles.SUPERADMIN ||
      user.role == AdminRoles.ADMIN
    ) {
      return this.borrowService.findOneById(+id, {
        relations: { books: true, user: true },
        where: { is_deleted: false },
        select: {
          id: true,
          borrow_date: true,
          due_date: true,
          return_date: true,
          overdue: true,
          books: {
            id: true,
            title: true,
            avialable: true,
          },
          user: {
            id: true,
            full_name: true,
            email: true,
            is_active: true,
          },
        },
        take: 1,
      });
    } else {
      throw new ConflictException(`You areant show this borrow`);
    }
  }

  // ------------------ UPDATE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Update Borrow' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.borrowDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.READER, UserRoles.LIBRARIAN)

  // ENDPONT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @Param('id') id: number,
    @Body() updateBorrowDto: UpdateBorrowDto,
    @GetUser('user') user: IToken,
  ) {    
    
    const { user_id } = updateBorrowDto;    
    if (
      user.id == user_id ||
      user.role == AdminRoles.SUPERADMIN ||
      user.role == AdminRoles.ADMIN || 
      user.role == UserRoles.LIBRARIAN
    ) {
      return this.borrowService.updateBorrow(id, updateBorrowDto, user);
    } else {
      throw new ConflictException(`You couldn't update this page`);
    }
  }

  // ------------------ SOFT DELETE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Borrow' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.borrowDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.LIBRARIAN)

  // ENDPONT
  @Patch(':id/soft')
  @ApiBearerAuth()

  // SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.borrowService.softDelete(+id);
  }

  // ------------------ DELETE ------------------
  // SWAGGER
  @ApiOperation({ summary: 'Delete Borrow' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.borrowDate))
  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)
  // ENDPONT
  @Delete(':id')
  @ApiBearerAuth()
  //  DELETE
  remove(@Param('id') id: number) {
    return this.borrowService.remove(+id);
  }
}
