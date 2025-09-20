import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from 'src/infrastructure/token/Token';
import { CryptoService } from 'src/infrastructure/bcrypt/Crypto';

@Module({
  providers: [AuthService, TokenService,CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
