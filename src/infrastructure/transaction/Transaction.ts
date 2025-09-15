import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from 'src/core/entity/post/wallet.entity';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    // wallet
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,

    // customer
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,

    // source
    private readonly dataSource: DataSource,
  ) {}

  async balanceToCustomer(
    card_id: number,
    customer_id: number,
    amount: number,
  ) {
    try {
      // transaction
      return await this.dataSource.transaction(async (manager) => {
        // wallet
        const wallet = await manager.findOne(WalletEntity, {
          where: { id: card_id },
        });

        //customer
        const customer = await manager.findOne(CustomerEntity, {
          where: { id: customer_id },
        });

        // check wallet or customer
        if (!wallet || !customer) {
          throw new NotFoundException(`Customer or Wallet not found`);
        }

        // transaction
        if (wallet.balance < amount) {
          throw new BadRequestException('not enough money your wallet');
        }

        // send
        wallet.balance -= amount;
        customer.balance += amount;

        // save
        await manager.save(wallet);
        await manager.save(customer);

        // all good return true
        return true;
      });
    } catch (error) {
      throw new BadRequestException(`Problem transaction ${error.message}`);
    }
  }
}
