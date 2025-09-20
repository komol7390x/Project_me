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
  Res,
  Query,
  ParseIntPipe,
  ConflictException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SwaggerResponse } from 'src/common/swagger/swagger-response';
import { SwaggerDate } from 'src/infrastructure/document/swagger-data';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { RolesGuard } from 'src/common/guard/role-guard';
import { AccessRoles } from 'src/common/decorator/roles-decorator';
import { AdminRoles } from 'src/common/enum/Role';
import { CookieGetter } from 'src/common/decorator/cookie-parse';
import { TokenUser } from 'src/common/enum/Token-user';
import { config } from 'src/config/env-config';
import { GetUser } from 'src/common/decorator/get-request';
import type { IToken } from 'src/infrastructure/token/token-interface';
import { SignInAdminDto } from './dto/sign-in-admin.dto';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { UpdatePassword } from '../auth/dto/update-password/update-password';
import { QueryPagination } from 'src/infrastructure/paganation/page-dto.entity';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService
  ) { }

  // ------------------------------------ CREATED ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Created Admin' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      SwaggerDate.adminDate,
      HttpStatus.CREATED,
      'Admin created',
    ),
  )
  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATED
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // ------------------------------------ SIGN IN ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.tokenRes))

  // ENDPOINT
  @Post('signin')

  // SIGN IN
  signIn(
    @Body() signInDto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
  }

  // ------------------------------------ NEW TOKEN ------------------------------------

  @ApiOperation({ summary: 'New Token' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.tokenRes))

  // ENDPOINT
  @Post('newtoken')

  // NEW TOKEN
  newToken(@CookieGetter(TokenUser.Admin) token: string) {
    return this.authService.newToken(this.adminService.getRepository, token);
  }

  // ------------------------------------ SIGN OUT ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Post('signout')
  @ApiBearerAuth()

  // SIGN OUT
  signOut(
    @CookieGetter(TokenUser.Admin) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.adminService.getRepository,
      token,
      res,
      TokenUser.Admin,
    );
  }
  // ------------------------------------ UPDATE OLD PASSWORD ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Update Password' })
  @ApiParam(SwaggerResponse.ApiParam())
  @ApiResponse(SwaggerResponse.ApiSuccessResponse())

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Post('update-password:id')
  @ApiBearerAuth()

  // UPDATE PASSWORD
  updatePassoword(
    @GetUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePassword: UpdatePassword,
  ) {
    if (id == config.SUPERADMIN.ID) {
      throw new ConflictException(`you could not this id => ${id} on Admin`);
    }

    if (user.id == id || user.role == AdminRoles.SUPERADMIN) {
       const { old_password, new_password } = updatePassword;
    return this.authService.UpdatePassword(
      old_password,
      new_password,
      id,
      this.adminService.getRepository,
    );
    }else{
      throw new ConflictException(`you could not this id=> ${id}`)
    }
   
  }
  // ------------------------------------ GET ALL PAGENATION ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Find All Pagenation' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.adminAll))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Get('page')
  @ApiBearerAuth()

  // PAGENATION
  findAllWithPagenation(@Query() queryDto: QueryPagination) {
    const { query, limit, page } = queryDto;
    return this.adminService.findAllWithPagination(query, limit, page);
  }
  // ------------------------------------ GET ALL ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Get All Admin' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse([SwaggerDate.adminAll, SwaggerDate.adminAll]))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Get()
  @ApiBearerAuth()

  // FIND ALL
  findAll() {
    return this.adminService.findAll({
      where: { is_deleted: false, role: AdminRoles.ADMIN },
      select: {
        id: true,
        username: true,
        role: true,
        full_name: true,
        createdAt: true
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ------------------------------------ GET ONE ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Get one' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.adminDate))
  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOneById(+id, {
      where: { role: AdminRoles.ADMIN },
      select: {
        id: true,
        full_name: true,
        username: true,
        is_active: true,
      },
    });
  }

  // ------------------------------------ UPDATE ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Update Admin' })
  @ApiParam(SwaggerResponse.ApiParam())
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.adminDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @GetUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    if (id == config.SUPERADMIN.ID) {
      throw new ConflictException(`you could not this id => ${id} on Admin`);
    }
    return this.adminService.updateAdmin(+id, updateAdminDto, user);
  }

  // ------------------------------------ SOFT DELETE ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Soft delete Admin' })
  @ApiParam(SwaggerResponse.ApiParam())
  @ApiResponse(SwaggerResponse.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  // UPDATE
  softDelete(@Param('id', ParseIntPipe) id: number) {
    if (id == config.SUPERADMIN.ID) {
      throw new ConflictException(`you could not this id => ${id} on Admin`);
    }
    return this.adminService.softDelete(+id);
  }
  // ------------------------------------ DELETE ------------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Delete Admin' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  // DELETE
  remove(@Param('id', ParseIntPipe) id: number) {
    if (id == config.SUPERADMIN.ID) {
      throw new ConflictException(`you could not this id => ${id} on Admin`);
    }
    return this.adminService.remove(+id);
  }
}