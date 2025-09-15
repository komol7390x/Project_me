import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { PostSawgger } from 'src/common/document/swagger.post';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';
import { GetRequestUser } from 'src/common/decorator/get-request.decorator';
import type { IToken } from 'src/infrastructure/token/token.interface';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ================================ CREATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Create Wallet' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.walletDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.CUSTOMER)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATE
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(createWalletDto);
  }
  // ================================ FIND ALL ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Wallet' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse([
      PostSawgger.walletAll,
      PostSawgger.walletAll,
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
    return this.walletService.findAll({
      relations: {
        customer: true,
      },
      where: {
        is_deleted: false,
      },
      select: {
        id: true,
        card_number: true,
        phone_number: true,
        balance: true,
        customer: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
  // ================================ GET ONE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Get One Wallet' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.walletDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.CUSTOMER, Roles.ADMIN)

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  async findOne(@GetRequestUser('user') user: IToken, @Param('id') id: number) {
    // check user wallet
    const wallet = await this.walletService.getRepository.findOne({
      where: { id },
    });
    if (!wallet) {
      throw new NotFoundException(`not found this id card => ${id} on Wallet`);
    }
    if (
      wallet.customer_id == user.id ||
      user.role == Roles.SUPERADMIN ||
      user.role == Roles.ADMIN
    ) {
      return this.walletService.findOneBY({
        relations: {
          customer: true,
        },
        where: {
          id,
          is_deleted: false,
        },
        select: {
          createdAt: true,
          id: true,
          card_name: true,
          card_number: true,
          balance: true,
          phone_number: true,
          customer: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: { createdAt: 'DESC' },
      });
    } else {
      throw new ForbiddenException(`You could not show this id card => ${id} on Wallet`);
    }
  }

  // ================================ UPDATE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Wallet' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(PostSawgger.walletDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(@Param('id') id: number, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletService.updateWallet(+id, updateWalletDto);
  }

  // ================================ SOFT DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft Delete Wallet' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.CUSTOMER)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  //SOFT DELETE
  softRemove(@Param('id') id: number) {
    return this.walletService.softDelete(+id);
  }

  // ================================ DELETE ================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Wallet' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  //DELETE
  remove(@Param('id') id: number) {
    return this.walletService.remove(+id);
  }
}
