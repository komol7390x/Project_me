import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { config } from 'src/config/env-config';
import { CryptoService } from 'src/infrastructure/bcrypt/Crypto';
import { successRes } from 'src/infrastructure/success-res/success-res';
import { TokenService } from 'src/infrastructure/token/Token';
import type { IToken } from 'src/infrastructure/token/token-interface';

import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: TokenService,
     private readonly crypto:CryptoService)
 { }
  
  // ================================== NEW TOKEN ==================================
  async newToken(repository: Repository<any>, token: string) {

    // check refresh token
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // check user have
    const user = await repository.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbiden user');
    }

    // give payload
    const payload: IToken = {
      id: user.id,
      is_active: user.is_active,
      role: user.role,
    };

    // access token
    const accessToken = await this.jwt.accessToken(payload);
    return successRes({ token: accessToken });
  }

  // ================================== SIGN OUT ==================================

  async signOut(repository: Repository<any>, token: string, res: Response, tokenKey: string) {

    // check refresh token
    const data: any = await this.jwt.verifyToken(
      token,
      config.TOKEN.REFRESH_KEY,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // check user has
    const user = await repository.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbiden user');
    }

    // clear token 
    res.clearCookie(tokenKey)
    return successRes({})
  }

  // ================================== UPDATE PASSWORD ==================================

  async UpdatePassword(old_password: string, new_password: string, id: number,repository:Repository<any>) {

    // check user
    const checkUser=await repository.findOne({where:{id}})
    if(!checkUser){
      throw new NotFoundException(`this id => ${id} not found on Admin`)
    }
    // check old password
    const checkPassword=await this.crypto.decrypt(old_password,checkUser.hashed_password)

    // not old password is true        
    if(!checkPassword){
      throw new UnauthorizedException('You are old password is invalid')
    }

    // password enrypt
    const hashed_password=await this.crypto.encrypt(new_password)

    //update password
    await repository.update(id,{hashed_password})
    return successRes({})
  }
}
