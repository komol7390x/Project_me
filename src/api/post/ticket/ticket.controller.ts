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
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { Roles } from 'src/common/enum/Roles';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { GetRequestUser } from 'src/common/decorator/get-request.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Ticket' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.ticketDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Ticket' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([
      PostSawgger.ticketAll,
      PostSawgger.ticketAll,
    ]),
  )

  // ENDPOINT
  @Get()

  //FIND ALL
  findAll() {
    return this.ticketService.findAll({
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        price: true,
        start_time: true,
        end_time: true,
        status: true,
        seat_number: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Ticket' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.ticketOne))

  // ENDPOINT
  @Get(':id')

  // FIND ONE
  async findOne(@Param('id') id: number) {
    return this.ticketService.findOneBY({
      relations: {
        showtime: {
          movies: true,
          room: true,
        },
      },
      where: {
        id,
        is_deleted: false,
      },
      select: {
        id: true,
        price: true,
        start_time: true,
        end_time: true,
        status: true,
        showtime: {
          id: true,
          is_active: true,
          room: {
            id: true,
            location: true,
            total_seats: true,
            name: true,
          },
          movies: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Ticket' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.ticketDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.updateTicket(+id, updateTicketDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Wallet' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.ticketService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Ticket' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.ticketService.remove(+id);
  }
}
