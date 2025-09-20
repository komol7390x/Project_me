import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { CryptoService } from 'src/infrastructure/bcrypt/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { RedisService } from 'src/infrastructure/redis/Redis';
import { UserEntity } from 'src/core/entity/user/user-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from 'src/infrastructure/telegram/Telegram';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthService, CryptoService,
    TokenService,
    RedisService,
    // TelegramService
  ],
  exports: [UserService]
})
export class UserModule { }
