import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/core/entity/user/admin-entity';
import { TokenService } from 'src/infrastructure/token/Token';
import { CryptoService } from 'src/infrastructure/bcrypt/Crypto';
import { AuthService } from '../auth/auth.service';
import { RedisService } from 'src/infrastructure/redis/Redis';

@Module({
  imports:[TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminController],
  providers: [AdminService,TokenService,CryptoService,AuthService,RedisService],
  exports:[AdminService]
})
export class AdminModule {}

