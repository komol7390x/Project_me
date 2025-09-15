import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entity/users/admin.entity';
import { AuthModule } from '../auth/auth.module';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { BaseService } from 'src/infrastructure/base/base.service';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminController],
  providers: [AdminService, CryptoService, TokenService,BaseService,AuthService],
  exports:[AdminService]
})
export class AdminModule {}
