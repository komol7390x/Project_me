import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';
import { ISuccessRes } from 'src/infrastructure/response/success.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { successRes } from 'src/infrastructure/response/succesRes';
import { IToken } from 'src/infrastructure/token/token.interface';
import { Roles } from 'src/common/enum/Roles';
import { SignInCustomer } from './dto/sign-in.dt';
import { Response } from 'express';
import { TelegramService } from 'src/infrastructure/telegram/send-otp';
import { generateOTP } from 'src/infrastructure/generator-otp/generator-otp';
import { config } from 'src/config/env.config';
import { EmailWithOtp } from './dto/with-email.dt';
import { RedisService } from 'src/infrastructure/redis/Redis';
import { TokenUser } from 'src/common/enum/token-user';
import { toSkipTake } from 'src/infrastructure/pagination/skip-page';
import { EmailService } from 'src/infrastructure/email/Email-OTP';
import { ForgetPassword } from './dto/forget-password.dto';
import { BalanceDto } from './dto/deposit-balance';
import { TransactionService } from 'src/infrastructure/transaction/Transaction';
import { WalletEntity } from 'src/core/entity/post/wallet.entity';

@Injectable()
export class CustomerService extends BaseService<
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerEntity
> {
  // ================================ CONSTRUCTOR ================================

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,

    @InjectRepository(WalletEntity)
    private readonly walletRepo: WalletEntity,

    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
    private readonly bot: TelegramService,
    private readonly redis: RedisService,
    // private readonly email: EmailService,
    private readonly transaction: TransactionService,
  ) {
    super(customerRepo); 
  }

  // ================================ CREATE CUSTOMER (1/2) ================================

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<ISuccessRes> {
    // destructure
    const { email, password, phone_number, ...rest } = createCustomerDto;

    // check email
    const existEmail = await this.customerRepo.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this user => ${email} is already exist on Customer`,
      );
    }

    // check phone number
    const existPhone = await this.customerRepo.findOne({
      where: { phone_number } as unknown as CustomerEntity,
    });
    if (existPhone) {
      throw new ConflictException(
        `this user => ${phone_number} is already exist on Customer`,
      );
    }

    // enrypt password
    const hashed_password = await this.crypto.encrypt(password);

    // generate otp
    const otp = generateOTP(config.OTP.NUMBER);

    // save Customer
    const data = { ...rest, email, phone_number, hashed_password, otp };

    // send Email OTP
    // await this.email.sendOtpEmail(email, otp);

    // send telegram otp
    await this.bot.sendCode({ email, otp });

    // save JSON format
    const result = JSON.stringify(data);

    // save redis
    await this.redis.setRedis(email, result, config.OTP.TIME);

    // return success
    return successRes({ email });
  }


  // ================================ REGSTRATION CUSTOMER (2/2) ================================

  async registrationOtp(emailWithOtp: EmailWithOtp): Promise<ISuccessRes> {
    // distructur
    const { email, otp } = emailWithOtp;

    // search email
    const existEmail = await this.customerRepo.findOne({ where: { email } });
    if (existEmail) {
      throw new ConflictException(
        `this is email => ${email} already exist on Customer`,
      );
    }

    // confirm otp
    const redisFind = await this.redis.getRedis(email);
    if (!redisFind) {
      throw new BadRequestException('Email is invalid');
    }
    const user = JSON.parse(redisFind);

    // invalid otp is error
    if (Number(user.otp) != otp) {
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

  // ================================ DEPOSIT BALANCE ================================

  async depositBalance(depositBalance: BalanceDto, customer_id: number) {
    const { card_id, balance } = depositBalance;

    // check card_id
    const id: number = Number(card_id);
    const { data }: any = await this.findByIdRepository(
      this.walletRepo as any,
      id,
    );

    // check card number
    if (data.customer_id != customer_id) {
      throw new ConflictException(`this is ${data.id} not your Card`);
    }

    // find customer
    const customer = await this.customerRepo.findOne({
      where: { id: customer_id },
    });
    if (!customer) {
      throw new NotFoundException(`not found this id => ${id} on Customer`);
    }

    // transaction
    const result = await this.transaction.balanceToCustomer(
      card_id,
      customer_id,
      balance,
    );

    // check result
    if (result) {
      return successRes({ balance });
    } else return successRes({ error: 'not transaction' });
  }
  // ================================ UPDATE CUSTOMER ================================

  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    user: IToken,
  ) {
    // check Customer
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`not found this id => ${id} on Customer`);
    }

    const { email, password, phone_number, is_active } = updateCustomerDto;

    // check email
    if (email) {
      const existEmail = await this.customerRepo.findOne({ where: { email } });
      if (existEmail && existEmail.id != id) {
        throw new ConflictException(`This username => ${email} already exist`);
      }
    }

    // check phone number
    if (phone_number) {
      const existPhone = await this.customerRepo.findOne({
        where: { phone_number } as unknown as CustomerEntity,
      });

      if (existPhone && existPhone.id != id) {
        throw new ConflictException(
          `This username => ${phone_number} already exist`,
        );
      }
    }

    // check Super Admin or Admin Role
    let hashed_password = customer.hashed_password;
    let active = customer.is_active;
    if (user.role == Roles.SUPERADMIN || user.role == Roles.ADMIN) {
      // check password
      if (password) {
        hashed_password = await this.crypto.encrypt(password);
      }

      // check is active
      if (is_active != null) {
        active = is_active;
      }
    }

    // update Customer
    await this.customerRepo.update(
      { id },
      { email, hashed_password, is_active: active },
    );

    // show user
    return await this.findOneById(id);
  }

  // ============================ FORGET PASSWORD ============================

  async forgetPassword(forgetPassword: EmailWithOtp): Promise<ISuccessRes> {
    // get email
    const { email } = forgetPassword;
    const exist = await this.customerRepo.findOne({ where: { email } });
    if (!exist) {
      throw new NotFoundException(`this ${email} not found on Customer`);
    }

    // take OTP
    const otp = generateOTP(6);

    // save code on redis
    await this.redis.setRedis(email, String(otp));

    // send OTP
    await this.bot.sendCode({ email, otp });

    // send email
    // await this.email.sendOtpEmail(email, otp);

    // return email

    return successRes({ email });
  }

  // ============================ CONFIRM OTP FOR FORGET PASSWORD ============================
  async confirmOtpWithEmail(
    forgetPassword: EmailWithOtp,
  ): Promise<ISuccessRes> {
    // dictructure
    const { email, otp } = forgetPassword;

    // get email
    const exist = await this.customerRepo.findOne({ where: { email } });
    if (!exist) {
      throw new NotFoundException(`this ${email} not found on Customer`);
    }

    // check OTP
    const redisOtp = await this.redis.getRedis(email);

    if (Number(redisOtp) != otp) {
      throw new ConflictException('OTP is invalid');
    }

    // return email and url
    return successRes({ email, url: config.UPDATE_URL });
  }

  // ============================ UPDATE PASSwORD FOR FORGET PASSWORD  ============================

  async updatePassword(forgetPassword: EmailWithOtp): Promise<ISuccessRes> {
    const { new_password, email } = forgetPassword;

    // get email
    const exist = await this.customerRepo.findOne({ where: { email } });
    if (!exist) {
      throw new NotFoundException(`this ${email} not found on Customer`);
    }

    // hashed password
    const hashed_password = await this.crypto.encrypt(String(new_password));

    // update password
    await this.customerRepo.update({ id: exist.id }, { hashed_password });

    return successRes({});
  }

  // ================================ SIGN IN ================================

  async signIn(signInDto: SignInCustomer, res: Response): Promise<ISuccessRes> {
    const { email, password } = signInDto;

    // check email
    const customer = await this.customerRepo.findOne({ where: { email } });
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
      TokenUser.Customer,
      refreshToken,
      15,
    );

    return successRes({ token: accessToken });
  }

  // ============================ FIND ALL PAGENATION ============================

  async findAllWithPagination(
    query: string = '',
    limit: number = 10,
    page: number = 1,
  ): Promise<ISuccessRes> {
    // fix skip and take
    const { take, skip } = toSkipTake(page, limit);

    // count
    const [user, count] = await this.customerRepo.findAndCount({
      where: {
        name: ILike(`%${query}%`),
        is_deleted: false,
        role: Roles.CUSTOMER,
      } as unknown as FindOptionsWhere<CustomerEntity>,
      order: {
        createdAt: 'DESC' as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
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
