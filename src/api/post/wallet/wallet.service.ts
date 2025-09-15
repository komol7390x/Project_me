import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletEntity } from 'src/core/entity/post/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService extends BaseService<
  CreateWalletDto,
  UpdateWalletDto,
  WalletEntity
> {
  constructor(
    // review
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,

    // customer
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
  ) {
    super(walletRepo);
  }

  // ============================ CREATE WALLET ============================

  async createWallet(createWalletDto: CreateWalletDto) {
    // distructure
    const { card_number, customer_id, phone_number } = createWalletDto;

    // check card_number
    const existNumber = await this.walletRepo.findOne({
      where: { card_number },
    });

    // check deleted
    if (!existNumber?.is_deleted) {
      if (existNumber) {
        throw new ConflictException(
          `this card_number => ${card_number} already exist on Wallet`,
        );
      }
    } else {
      await this.remove(existNumber.id);
    }

    // check customer id
    const { data }: any = await this.findByIdRepository(
      this.customerRepo,
      customer_id,
    );

    if (data.phone_number != phone_number) {
      throw new ConflictException(
        `this ${phone_number} is incorect on Customer`,
      );
    }
    // create
    return super.create(createWalletDto);
  }

  // ============================ UPDATE WALLET ============================

  async updateWallet(id: number, updateWalletDto: UpdateWalletDto) {
    // distructure
    const { card_number, customer_id } = updateWalletDto;

    // check card_number
    if (card_number) {
      const existNumber = await this.walletRepo.findOne({
        where: { card_number },
      });

      // check deleted
      if (!existNumber?.is_deleted) {
        if (existNumber) {
          throw new ConflictException(
            `this card_number => ${card_number} already exist on Wallet`,
          );
        }
      } else {
        await this.remove(existNumber.id);
      }
    }

    // check customer id
    if (customer_id) {
      await this.findByIdRepository(this.customerRepo, customer_id);
    }

    // update
    return super.update(id, updateWalletDto);
  }
}
