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
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  customerAll,
  customerData,
  tokenRes,
} from 'src/common/document/swagger.user';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthService } from '../auth/auth.service';
import { SwaggerApi } from 'src/common/swagger-apiresponse/swagger-response';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/enum/Roles';
import { CookieGetter } from 'src/common/decorator/cooki-getter.decorator';
import { UpdatePassword } from '../admin/dto/update-password.dto';
import { QueryPagination } from 'src/common/dto/query.pagenation';
import { GetRequestUser } from 'src/common/decorator/get-request.decorator';
import { SignInCustomer } from './dto/sign-in.dt';
import { TokenUser } from 'src/common/enum/token-user';
import type { IToken } from 'src/infrastructure/token/token.interface';
import type { Response } from 'express';
import { EmailWithOtp } from './dto/with-email.dt';
import { config } from 'src/config/env.config';
import { BalanceDto } from './dto/deposit-balance';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  // ================================= REGIRSTRATION (1/2) =================================

  // SWAGGER
  @ApiOperation({ summary: 'Created Customer (1/2)' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse(
      { email: 'www.example@gmail.com' },
      HttpStatus.OK,
      'Waiting otp on Email',
    ),
  )
  // ENDPOINT
  @Post()

  // CONFIRM OTP FOR REGISTRED
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  // ================================= CONFRIM OTP REGIRSTRATION (2/2) =================================

  // SWAGGER
  @ApiOperation({ summary: 'Confirm OTP (2/2)' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse(
      { customerData },
      HttpStatus.OK,
      'Created Customer',
    ),
  )
  // ENDPOINT
  @Post('otp')

  // REGISTRED
  registration(@Body() emailWithOtp: EmailWithOtp) {
    return this.customerService.registrationOtp(emailWithOtp);
  }

  // ================================= DEPOSIT BALANCE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Deposit balance' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse())

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, 'ID')

  // ENDPOINT
  @Post('deposit-balance:id')
  @ApiBearerAuth()

  // DEPOSIT BALANCE
  depositBalance(
    @Param('id', ParseIntPipe) id: number,
    @Body() depositBalance: BalanceDto,
  ) {
    return this.customerService.depositBalance(depositBalance, id);
  }
  // ================================= FORGET PASSWORD (1/3) =================================

  // SWAGGER
  @ApiOperation({ summary: 'Forget password (1/3)' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse(
      { email: 'www.example@gmail.com' },
      HttpStatus.OK,
      'Send OTP to Email',
    ),
  )
  // ENDPOINT
  @Post('forget-password')

  // FORGET PASSWORD
  forgetPassword(@Body() emailWithOtp: EmailWithOtp) {
    return this.customerService.forgetPassword(emailWithOtp);
  }

  // ================================= CONFIRM OTP FOR FORGET PASSWORD (2/3) =================================

  // SWAGGER
  @ApiOperation({ summary: 'Confirm password for update (2/3)' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse(
      { link: `http:localhost:3000/update-password/url` },
      HttpStatus.OK,
      'Enter this link and update',
    ),
  )
  // ENDPOINT
  @Post('confirm-otp-for-password')

  // FORGET PASSWORD
  confirmOtpWithEmail(@Body() emailWithOtp: EmailWithOtp) {
    return this.customerService.confirmOtpWithEmail(emailWithOtp);
  }

  // ================================= UPDATE PASSWORD FOR FORGET PASSWORD (3/3) =================================

  // SWAGGER
  @ApiOperation({ summary: 'Update password enter new password (3/3)' })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse(
      {},
      HttpStatus.OK,
      'Enter this link and update',
    ),
  )
  // ENDPOINT
  @Post(String(config.UPDATE_URL))

  // FORGET PASSWORD
  updatePassword(@Body() emailWithOtp: EmailWithOtp) {
    return this.customerService.updatePassword(emailWithOtp);
  }

  // ================================= SIGN IN =================================

  // SWAGGER
  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(tokenRes))

  // ENDPOINT
  @Post('signin')

  // SIGN IN
  signIn(
    @Body() signInDto: SignInCustomer,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customerService.signIn(signInDto, res);
  }

  // ================================= NEW TOKEN =================================

  // SWAGGER
  @ApiOperation({ summary: 'New Token' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(tokenRes))

  // ENDPOINT
  @Post('newtoken')

  // NEW TOKEN
  newToken(@CookieGetter(TokenUser.Customer) token: string) {
    return this.authService.newToken(this.customerService.getRepository, token);
  }

  // ================================= SIGN OUT =================================

  // SWAGGER
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')

  // ENDPOINT
  @Post('signout')
  @ApiBearerAuth()

  // SIGN OUT
  signOut(
    @CookieGetter(TokenUser.Customer) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.customerService.getRepository,
      token,
      res,
      TokenUser.Customer,
    );
  }

  // ================================= UPDATE OLD PASSWORD =================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Password' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse())

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')

  // ENDPOINT
  @Post('update-password:id')
  @ApiBearerAuth()

  // UPDATE PASSWORD
  updatePassoword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePassword: UpdatePassword,
  ) {
    const { old_password, new_password } = updatePassword;
    return this.authService.UpdatePassword(
      old_password,
      new_password,
      id,
      this.customerService.getRepository,
    );
  }

  // ================================= GET ALL PAGENATION =================================

  // SWAGGER
  @ApiOperation({ summary: 'Find All Pagenation' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([customerData, customerData]))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Get('page')
  @ApiBearerAuth()

  // PAGENATION
  findAllWithPagenation(@Query() queryDto: QueryPagination) {
    const { query, limit, page } = queryDto;

    return this.customerService.findAllWithPagination(query, limit, page);
  }

  // ================================= GET ALL =================================

  // SWAGGER
  @ApiOperation({ summary: 'Get All Customer' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([customerAll, customerAll]))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Get()
  @ApiBearerAuth()

  // FIND ALL
  findAll() {
    return this.customerService.findAll({
      where: { is_deleted: false, role: Roles.CUSTOMER },
      relations: { reviews: true },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone_number: true,
        reviews: {
          comment: true,
          createdAt: true,
          rating: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ================================= GET ONE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Get one' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(customerData))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOneById(+id, {
      where: {
        is_deleted: false,
        role: Roles.CUSTOMER,
        wallets: { is_deleted: false },
        // reviews: { is_deleted: false },
      },
      relations: { reviews: true, wallets: true },
      select: {
        id: true,
        email: true,
        role: true,
        balance: true,
        phone_number: true,
        name: true,
        createdAt: true,
        is_active: true,
        reviews: {
          comment: true,
          createdAt: true,
          rating: true,
        },
        wallets: {
          id: true,
          card_name: true,
          card_number: true,
          phone_number: true,
          balance: true,
          createdAt: true,
        },
      },
    });
  }

  // ================================= UPDATE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Update Customer' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse(customerData))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @GetRequestUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(+id, updateCustomerDto, user);
  }

  // ================================= SOFT DELETE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Soft delete Customer' })
  @ApiParam(SwaggerApi.ApiParam())
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  // UPDATE
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.softDelete(+id);
  }

  // ================================= DELETE =================================

  // SWAGGER
  @ApiOperation({ summary: 'Delete Customer' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  // DELETE
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.remove(+id);
  }
}
