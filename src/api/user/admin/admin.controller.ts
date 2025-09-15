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
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import {
  adminAll,
  adminData,
  tokenRes,
} from 'src/common/document/swagger.user';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles';
import { SignInAdminDto } from './dto/sign-in.dto';
import { GetRequestUser } from 'src/common/decorator/get-request.decorator';
import type { IToken } from 'src/infrastructure/token/token.interface';
import { CookieGetter } from 'src/common/decorator/cooki-getter.decorator';
import { AuthService } from '../auth/auth.service';
import type { Response } from 'express';
import { QueryPagination } from 'src/common/dto/query.pagenation';
import { UpdatePassword } from './dto/update-password.dto';
import { TokenUser } from 'src/common/enum/token-user';
import { config } from 'src/config/env.config';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  // ================================= CREATED =================================

  // SWAGGER
  @ApiOperation({ summary: 'Created Admin' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse(
      adminData,
      HttpStatus.CREATED,
      'Admin created',
    ),
  )
  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Post()
  @ApiBearerAuth()

  // CREATED
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // ================================= SIGN IN =================================

  // SWAGGER
  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(tokenRes))

  // ENDPOINT
  @Post('signin')

  // SIGN IN
  signIn(
    @Body() signInDto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
  }

  // ================================= NEW TOKEN =================================
  @ApiOperation({ summary: 'New Token' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(tokenRes))

  // ENDPOINT
  @Post('newtoken')

  // NEW TOKEN
  newToken(@CookieGetter(TokenUser.Admin) token: string) {
    return this.authService.newToken(this.adminService.getRepository, token);
  }

  // ================================= SIGN OUT =================================

  // SWAGGER
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')

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
  // ================================= UPDATE OLD PASSWORD =================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Password' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse())

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Post('update-password:id')
  @ApiBearerAuth()

  // UPDATE PASSWORD
  updatePassoword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePassword: UpdatePassword,
  ) {
     if (id == config.SUPERADMIN.ID) {
       throw new ConflictException(`you could not this id => ${id} on Admin`);
     }
    const { old_password, new_password } = updatePassword;
    return this.authService.UpdatePassword(
      old_password,
      new_password,
      id,
      this.adminService.getRepository,
    );
  }
  // ================================= GET ALL PAGENATION =================================
  // SWAGGER
  @ApiOperation({ summary: 'Find All Pagenation' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([adminData, adminData]))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Get('page')
  @ApiBearerAuth()

  // PAGENATION
  findAllWithPagenation(@Query() queryDto: QueryPagination) {
    const { query, limit, page } = queryDto;
    return this.adminService.findAllWithPagination(query, limit, page);
  }
  // ================================= GET ALL =================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([adminAll, adminAll]))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

  // ENDPOINT
  @Get()
  @ApiBearerAuth()

  // FIND ALL
  findAll() {
    return this.adminService.findAll({
      where: { is_deleted: false, role: Roles.ADMIN },
      select: {
        id: true,
        username: true,
        role: true,
        balance: true,
        name: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ================================= GET ONE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Get one' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData))
  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOneById(+id, {
      where: { role: Roles.ADMIN },
      relations: { movies: true },
      select: {
        id: true,
        name: true,
        username: true,
        is_active: true,
        movies: {
          id: true,
          title: true,
          createdAt: true,
        },
      },
    });
  }

  // ================================= UPDATE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Admin' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @GetRequestUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
     if (id == config.SUPERADMIN.ID) {
       throw new ConflictException(`you could not this id => ${id} on Admin`);
     }
    return this.adminService.updateAdmin(+id, updateAdminDto, user);
  }

  // ================================= SOFT DELETE =================================
  // SWAGGER
  @ApiOperation({ summary: 'Soft delete Admin' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

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
  // ================================= DELETE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN)

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
