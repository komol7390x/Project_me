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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { SwaggerResponse } from 'src/common/swagger/swagger-response';
import { SwaggerDate } from 'src/infrastructure/document/swagger-data';
import { AuthGuard } from 'src/common/guard/auth-guard';
import { RolesGuard } from 'src/common/guard/role-guard';
import { EmailUserDto } from './dto/email';
import { EmailWithDto } from './dto/email-send-otp';
import { config } from 'src/config/env-config';
import { EmailPassword } from './dto/email-password.dto';
import { SignInUSerDto } from './dto/sign-in-user.dto';
import type { Response } from 'express';
import { CookieGetter } from 'src/common/decorator/cookie-parse';
import { TokenUser } from 'src/common/enum/Token-user';
import { AccessRoles } from 'src/common/decorator/roles-decorator';
import { AdminRoles, UserRoles } from 'src/common/enum/Role';
import { UpdatePassword } from '../auth/dto/update-password/update-password';
import { QueryPagination } from 'src/infrastructure/paganation/page-dto.entity';
import { GetUser } from 'src/common/decorator/get-request';
import type { IToken } from 'src/infrastructure/token/token-interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // ---------------------------------- LIBRARIAN REGIRSTRATION (1/2) ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Created Librarian (1/2)' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      { email: 'www.example@gmail.com' },
      HttpStatus.OK,
      'Waiting otp on Email',
    ),
  )
  // ENDPOINT
  @Post('librarian')

  // CONFIRM OTP FOR REGISTRED
  createLibrarian(@Body() createUserDto: CreateUserDto) {
    const data = { role: UserRoles.LIBRARIAN, ...createUserDto };
    return this.userService.createUser(data);
  }
  // ---------------------------------- READER REGIRSTRATION (1/2) ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Created Reader (1/2)' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      { email: 'www.example@gmail.com' },
      HttpStatus.OK,
      'Waiting otp on Email',
    ),
  )
  // ENDPOINT
  @Post('reader')

  // CONFIRM OTP FOR REGISTRED
  createReader(@Body() createUserDto: CreateUserDto) {
    const data = { role: UserRoles.READER, ...createUserDto };
    return this.userService.createUser(data);
  }
  // ---------------------------------- CONFRIM OTP REGIRSTRATION (2/2) ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Confirm OTP (2/2)' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      SwaggerDate.userDate,
      HttpStatus.OK,
      'Created User',
    ),
  )
  // ENDPOINT
  @Post('otp')

  // REGISTRED
  registration(@Body() emailWithOtp: EmailWithDto) {
    return this.userService.registrationOtp(emailWithOtp);
  }
  // ---------------------------------- FORGET PASSWORD (1/3) ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Forget password (1/3)' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      { email: 'www.example@gmail.com' },
      HttpStatus.OK,
      'Send OTP to Email',
    ),
  )
  // ENDPOINT
  @Post('forget-password')

  // FORGET PASSWORD
  forgetPassword(@Body() emailWithOtp: EmailUserDto) {
    return this.userService.forgetPassword(emailWithOtp);
  }

  // ---------------------------------- CONFIRM OTP FOR FORGET PASSWORD (2/3) ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Confirm password for update (2/3)' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      { link: `http:localhost:3000/update-password/url` },
      HttpStatus.OK,
      'Enter this link and update',
    ),
  )
  // ENDPOINT
  @Post('confirm-otp-for-password')

  // FORGET PASSWORD
  confirmOtpWithEmail(@Body() emailWithOtp: EmailWithDto) {
    return this.userService.confirmOtpWithEmail(emailWithOtp);
  }

  // ---------------------------------- UPDATE PASSWORD FOR FORGET PASSWORD (3/3) ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Update password enter new password (3/3)' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse(
      {},
      HttpStatus.OK,
      'Enter this link and update',
    ),
  )
  // ENDPOINT
  @Post(String(config.UPDATE_URL))

  // FORGET PASSWORD
  updatePassword(@Body() newPassord: EmailPassword) {
    return this.userService.updatePassword(newPassord);
  }

  // ---------------------------------- SIGN IN ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.tokenRes))

  // ENDPOINT
  @Post('signin')

  // SIGN IN
  signIn(
    @Body() signInDto: SignInUSerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.signIn(signInDto, res);
  }

  // ---------------------------------- NEW TOKEN ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'New Token' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.tokenRes))

  // ENDPOINT
  @Post('newtoken')

  // NEW TOKEN
  newToken(@CookieGetter(TokenUser.User) token: string) {
    return this.authService.newToken(this.userService.getRepository, token);
  }

  // ---------------------------------- SIGN OUT ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, 'ID')

  // ENDPOINT
  @Post('signout:id')
  @ApiBearerAuth()

  // SIGN OUT
  signOut(
    @Param('id', ParseIntPipe) id: number,
    @CookieGetter(TokenUser.User) token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(
      this.userService.getRepository,
      token,
      res,
      TokenUser.User,
    );
  }

  // ---------------------------------- UPDATE OLD PASSWORD ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Update Password' })
  @ApiParam(SwaggerResponse.ApiParam())
  @ApiResponse(SwaggerResponse.ApiSuccessResponse())

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, 'ID')

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
      this.userService.getRepository,
    );
  }

  // ---------------------------------- GET ALL PAGENATION ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Find All Pagenation' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse([
      SwaggerDate.userDate,
      SwaggerDate.userDate,
    ]),
  )

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)

  // ENDPOINT
  @Get('page')
  @ApiBearerAuth()

  // PAGENATION
  findAllWithPagenation(@Query() queryDto: QueryPagination) {
    const { query, limit, page, findEmail } = queryDto;

    return this.userService.findAllWithPagination(
      query,
      limit,
      page,
      findEmail,
    );
  }

  // ---------------------------------- GET ALL ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Get All User' })
  @ApiResponse(
    SwaggerResponse.ApiSuccessResponse([
      SwaggerDate.userDate,
      SwaggerDate.userDate,
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
    return this.userService.findAll({
      relations: { borrows: true, history: true },
      where: { is_deleted: false },
      select: {
        id: true,
        email: true,
        is_active: true,
        borrows: {
          id: true,
          borrow_date: true,
          overdue: true,
        },
        history: {
          id: true,
          date: true,
          action: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  // ---------------------------------- GET ONE ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Get one' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.userDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, 'ID')

  // ENDPOINT
  @Get(':id')
  @ApiBearerAuth()

  // FIND ONE
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(+id, {
      where: { is_deleted: false },
      relations: { borrows: true, history: true },
      select: {
        id: true,
        is_active: true,
        role: true,
        createdAt: true,
        full_name: true,
        email: true,
        borrows: {
          id: true,
          borrow_date: true,
          return_date: true,
          due_date: true,
          overdue: true,
        },
        history: {
          id: true,
          date: true,
          action: true,
          
        },
      },
    });
  }

  // ---------------------------------- UPDATE ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Update User' })
  @ApiParam(SwaggerResponse.ApiParam())
  @ApiResponse(SwaggerResponse.ApiSuccessResponse(SwaggerDate.userDate))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, 'ID')

  // ENDPOINT
  @Patch(':id')
  @ApiBearerAuth()

  // UPDATE
  update(
    @GetUser('user') user: IToken,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+id, updateUserDto, user);
  }

  // ---------------------------------- SOFT DELETE ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Soft delete User' })
  @ApiParam(SwaggerResponse.ApiParam())
  @ApiResponse(SwaggerResponse.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)

  // ENDPOINT
  @Patch('delete/:id')
  @ApiBearerAuth()

  // UPDATE
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(+id);
  }

  // ---------------------------------- DELETE ----------------------------------

  // SWAGGER
  @ApiOperation({ summary: 'Delete users' })
  @ApiResponse(SwaggerResponse.ApiSuccessResponse({}))

  // GUARD
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)

  // ENDPOINT
  @Delete(':id')
  @ApiBearerAuth()

  // DELETE
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
