import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/enum/Roles';
import type { IToken } from 'src/infrastructure/token/token.interface';
import { GetRequestUser } from 'src/common/decorator/get-request.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.showtimeDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.CUSTOMER, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetRequestUser('user') user: IToken,
  ) {    
    if (
      createOrderDto.customer_id == user.id ||
      user.role == Roles.ADMIN ||
      user.role == Roles.SUPERADMIN
    ) {      
      return this.orderService.createOrder(createOrderDto);
    } else {      
      throw new ForbiddenException('you could not order');
    }
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Order' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([
      PostSawgger.showtimeAll,
      PostSawgger.showtimeAll,
    ]),
  )

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Get()
  @ApiBearerAuth()

  //FIND ALL
  findAll() {
    return this.orderService.findAll({
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        quantity: true,
        status: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Order' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.showtimeDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  async findOne(@GetRequestUser('user') user: IToken, @Param('id') id: number) {
    const order = await this.orderService.getRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('not found order');
    }
    if (
      Number(order.customer_id) == Number(user.id) ||
      user.role == Roles.ADMIN ||
      user.role == Roles.SUPERADMIN
    ) {
      return this.orderService.findOneBY({
        relations: {
          customer: true,
          ticket: { showtime: { movies: true } },
        },
        where: {
          // id: id,
          is_deleted: false,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          quantity: true,
          status: true,
          customer: { id: true, email: true, name: true },
          ticket: { showtime: { movies: true } },
        },
        order: { createdAt: 'DESC' },
      });
    } else {
      throw new ForbiddenException('you could show order history');
    }
  }
  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Order' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.showtimeDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, Roles.CUSTOMER)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(+id, updateOrderDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Order' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.orderService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Order' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.orderService.remove(+id);
  }
}
