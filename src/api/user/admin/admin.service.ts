import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { AdminEntity } from 'src/core/entity/users/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ISuccessRes } from 'src/infrastructure/response/success.interface';
import { OnModuleInit } from '@nestjs/common';
import { Roles } from 'src/common/enum/Roles';
import { config } from 'src/config/env.config';
import { successRes } from 'src/infrastructure/response/succesRes';
import { Response } from 'express';
import { IToken } from 'src/infrastructure/token/token.interface';
import { SignInAdminDto } from './dto/sign-in.dto';
import { TokenUser } from 'src/common/enum/token-user';
import { toSkipTake } from 'src/infrastructure/pagination/skip-page';
@Injectable()
export class AdminService
  extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }
  // ================================ ON MODULE INIT ================================
  async onModuleInit(): Promise<void> {
    try {
      // check Role
      const exist = await this.adminRepo.findOne({
        where: { role: Roles.SUPERADMIN },
      });
      if (!exist) {
        // hashed password
        const hashed_password = await this.crypto.encrypt(
          config.SUPERADMIN.PASSWORD,
        );
        //created Super Admin
        const superAdmin = this.adminRepo.create({
          name: config.SUPERADMIN.NAME,
          username: config.SUPERADMIN.USERNAME,
          hashed_password,
          role: Roles.SUPERADMIN,
        });
        // save
        await this.adminRepo.save(superAdmin);
        console.log(`${Roles.SUPERADMIN} is created`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error on created super admin');
    }
  }

  // ================================ CREATE ADMIN ================================
  async createAdmin(createAdminDto: CreateAdminDto): Promise<ISuccessRes> {
    const { username, password, ...rest } = createAdminDto;

    // check username
    const existName = await this.adminRepo.findOne({ where: { username } });
    if (existName) {
      throw new ConflictException(
        `this user => ${username} already exist on Admin`,
      );
    }

    // enrypt password
    const hashed_password = await this.crypto.encrypt(password);

    // save Admin
    const data = this.adminRepo.create({ ...rest, username, hashed_password });
    await this.adminRepo.save(data);
    delete data.is_deleted;
    return successRes(data);
  }

  // ================================ UPDATE ADMIN ================================
  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto, user: IToken) {
    // dont update Super Admin
    if (id == config.SUPERADMIN.ID) {
      throw new ConflictException(`You cant update this ${id} on SUPERADMIN`);
    }
    // check admin
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`not found this id => ${id} on Admin`);
    }

    // check username
    const { username, password, is_active } = updateAdminDto;
    if (username) {
      const existName = await this.adminRepo.findOne({ where: { username } });
      if (existName && existName.id != id) {
        throw new ConflictException(
          `This username => ${username} already exist`,
        );
      }
    }

    // check Super Admin Role
    let hashed_password = admin.hashed_password;
    let active = admin.is_active;
    if (user.role == Roles.SUPERADMIN) {
      // check password
      if (password) {
        hashed_password = await this.crypto.encrypt(password);
      }
      // check is active
      if (is_active != null) {
        active = is_active;
      }
    }

    // update Admin
    await this.adminRepo.update(
      { id },
      { username, hashed_password, is_active: active },
    );
    return await this.findOneById(id);
  }

  // ================================ SIGN IN ================================

  async signIn(signInDto: SignInAdminDto, res: Response) {
    const { username, password } = signInDto;

    // check username
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (!admin) {
      throw new UnauthorizedException('Username or Password is incorect');
    }

    // check password
    const checkPass = await this.crypto.decrypt(
      password,
      admin?.hashed_password as string,
    );

    if (!admin || !checkPass) {
      throw new UnauthorizedException('Username or Password is incorect');
    }

    // give payload
    const payload: IToken = {
      id: Number(admin.id),
      is_active: admin.is_active,
      role: admin.role,
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
  ) {
    // fix skip and take
    const { take, skip } = toSkipTake(page, limit);

    // count
    const [user, count] = await this.adminRepo.findAndCount({
      where: {
        username: ILike(`%${query}%`),
        is_deleted: false,
        role: Roles.ADMIN,
      } as unknown as FindOptionsWhere<AdminEntity>,
      order: {
        createdAt: 'DESC' as any,
      },
      select: {
        id: true,
        name: true,
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
