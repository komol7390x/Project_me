import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { RedisService } from 'src/infrastructure/redis/Redis';
import { CryptoService } from 'src/infrastructure/crypt/Crypto';

@Module({
  providers: [AuthService, TokenService, RedisService,CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
