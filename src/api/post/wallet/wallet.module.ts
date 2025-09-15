import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from 'src/core/entity/post/wallet.entity';
import { CustomerEntity } from 'src/core/entity/users/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, CustomerEntity])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
