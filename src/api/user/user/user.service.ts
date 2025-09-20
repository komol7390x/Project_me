import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from 'src/infrastructure/base/base-service';
import { UserEntity } from 'src/core/entity/user/user-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CryptoService } from 'src/infrastructure/bcrypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { ISuccessRes } from 'src/infrastructure/success-res/success-interface';
import { successRes } from 'src/infrastructure/success-res/success-res';
import type { IToken } from 'src/infrastructure/token/token-interface';
import { AdminRoles, UserRoles } from 'src/common/enum/Role';
import { SignInUSerDto } from './dto/sign-in-user.dto';
import { Response } from 'express';
import { TokenUser } from 'src/common/enum/Token-user';
import { toSkipTake } from 'src/infrastructure/paganation/skip-page';
import { generatorOTP } from 'src/infrastructure/generator-otp/generator-otp';
import { config } from 'src/config/env-config';
import { RedisService } from 'src/infrastructure/redis/Redis';
import { EmailUserDto } from './dto/email';
import { EmailWithDto } from './dto/email-send-otp';
import { EmailPassword } from './dto/email-password.dto';
import { TelegramService } from 'src/infrastructure/telegram/Telegram';

@Injectable()
export class UserService extends BaseService<CreateUserDto, UpdateUserDto, UserEntity> {
  // ------------------------------ CONSTRUCTOR ------------------------------

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly redis: RedisService,
    // private readonly bot:TelegramService,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,

    // private readonly transaction: TransactionService,
  ) {
    super(userRepo);
  }

  // ------------------------------ CREATE USER (1/2) ------------------------------

  async createUser(createUserDto: CreateUserDto): Promise<ISuccessRes> {
    // destructure
    const { email, password, ...rest } = createUserDto;

    // check email
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this user => ${email} is already exist on users`,
      );
    }

    // enrypt password
    const hashed_password = await this.crypto.encrypt(password);

    // generate otp
    const otp = generatorOTP(config.OTP_NUMBER);

    // save users
    const data = { ...rest, email, hashed_password, otp };

    // telegram bot
    // await this.bot.sendCode({email,otp})

    // save JSON format
    const result = JSON.stringify(data);

    // save redis
    await this.redis.setRedis(email, result, 600);

    // return success
    return successRes({ email, otp });
  }


  // ------------------------------ REGSTIRATION USER (2/2) ------------------------------

  async registrationOtp(emailWithOtp: EmailWithDto): Promise<ISuccessRes> {

    // distructur
    const { email, otp } = emailWithOtp;

    // search email
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this is email => ${email} already exist on User`,
      );
    }

    // confirm otp
    const redisFind = await this.redis.getRedis(email);

    if (!redisFind) {
      throw new BadRequestException('Email is invalid');
    }

    // JSON parse
    const user = JSON.parse(redisFind);

    // invalid otp is error
    if (Number(user.otp) != Number(otp)) {
      throw new BadRequestException('OTP is invalid');
    }

    // delete otp in  cache
    await this.redis.delRedis(email);

    // delete otp on data
    delete user.otp;
    delete user.new_password;

    // save create
    return super.create(user);
  }

  // ------------------------------ UPDATE ------------------------------

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    user: IToken,
  ) {
    // check User
    const customer = await this.userRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`not found this id => ${id} on user`);
    }

    const { email, password, is_active, role } = updateUserDto;

    // check email
    if (email) {
      const existEmail = await this.userRepo.findOne({ where: { email } });
      if (existEmail && existEmail.id != id) {
        throw new ConflictException(`This username => ${email} already exist`);
      }
    }


    // check Super Admin or Admin Role
    let hashed_password = customer.hashed_password;
    let active = customer.is_active;
    let userRole = customer.role
    if (user.role == AdminRoles.SUPERADMIN || user.role == AdminRoles.ADMIN) {
      if (role) {
        userRole = role
      }
      // check password
      if (password) {
        hashed_password = await this.crypto.encrypt(password);
      }

      // check is active
      if (is_active != null) {
        active = is_active;
      }
    }

    // update users
    await this.userRepo.update(
      { id },
      { email, hashed_password, is_active: active, role: userRole },
    );

    // show user
    return await this.findOneById(id);
  }

  // ------------------------------ FORGET PASSWORD (1/3) ------------------------------

  async forgetPassword(forgetPassword: EmailUserDto): Promise<ISuccessRes> {
    // get email
    const { email } = forgetPassword;
    const exist = await this.userRepo.findOne({ where: { email } });
    if (!exist) {
      throw new NotFoundException(`this ${email} not found on users`);
    }

    // take OTP
    const otp = generatorOTP(6);

    // telegram bot
    // await this.bot.sendCode({email,otp})

    // save code on redis
    await this.redis.setRedis(email, String(otp));


    return successRes({ email, otp });
  }

  // ------------------------------ CONFIRM OTP FOR FORGET PASSWORD (2/3)------------------------------
  async confirmOtpWithEmail(
    forgetPassword: EmailWithDto,
  ): Promise<ISuccessRes> {
    // dictructure
    const { email, otp } = forgetPassword;

    // get email
    const exist = await this.userRepo.findOne({ where: { email } });
    if (!exist) {
      throw new NotFoundException(`this ${email} not found on users`);
    }

    // check OTP
    const redisOtp = await this.redis.getRedis(email);

    if (Number(redisOtp) != Number(otp)) {
      throw new ConflictException('OTP is invalid');
    }

    // return email and url
    return successRes({ email, message: 'success' });
  }

  // ------------------------------ UPDATE PASSwORD FOR FORGET PASSWORD (3/3)  ------------------------------

  async updatePassword(forgetPassword: EmailPassword): Promise<ISuccessRes> {
    const { new_password, email } = forgetPassword;

    // get email
    const exist = await this.userRepo.findOne({ where: { email } });
    if (!exist) {
      throw new NotFoundException(`this ${email} not found on users`);
    }

    // hashed password
    const hashed_password = await this.crypto.encrypt(String(new_password));

    // update password
    await this.userRepo.update({ id: exist.id }, { hashed_password });

    return successRes({});
  }

  // ------------------------------ SIGN IN ------------------------------

  async signIn(signInDto: SignInUSerDto, res: Response): Promise<ISuccessRes> {
    const { email, password } = signInDto;

    // check email
    const customer = await this.userRepo.findOne({ where: { email } });
    if (!customer) {
      throw new UnauthorizedException('Email or Password is incorect');
    }

    // check password
    const checkPass = await this.crypto.decrypt(
      password,
      customer?.hashed_password as string,
    );

    if (!customer || !checkPass) {
      throw new UnauthorizedException('Username or Password is incorect');
    }

    // give payload
    const payload: IToken = {
      id: Number(customer.id),
      is_active: customer.is_active,
      role: customer.role,
    };

    // access token
    const accessToken = await this.tokenService.accessToken(payload);

    // refresh token
    const refreshToken = await this.tokenService.refreshToken(payload);

    // write cookie
    await this.tokenService.writeCookie(
      res,
      TokenUser.User,
      refreshToken,
      15,
    );

    return successRes({ token: accessToken });
  }

  // ------------------------------ FIND ALL PAGENATION ------------------------------

  async findAllWithPagination(
    query: string = '',
    limit: number = 10,
    page: number = 1,
    findEmail: string = '',
  ): Promise<ISuccessRes> {
    // fix skip and take
    const { take, skip } = toSkipTake(page, limit);

    // count
    const [user, count] = await this.userRepo.findAndCount({
      where: {
        email: ILike(`%${findEmail}%`),
        full_name: ILike(`%${query}%`),
        is_deleted: false,
      } as unknown as FindOptionsWhere<UserEntity>,
      order: {
        createdAt: 'DESC' as any,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        is_active: true
      } as any,
      take,
      skip,
    });

    // total page
    const total_page = Math.ceil(count / limit);

    // return success
    return successRes({
      data: user,
      mete: {
        page,
        total_page,
        total_count: count,
        hasNextPage: total_page > page,
      },
    });
  }
}
