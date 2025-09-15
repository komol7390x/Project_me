import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { config } from 'src/config/env.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // ========================== CONTEXT ==========================
    const request = context.switchToHttp().getRequest();
    const auth: string = request.headers.authorization;

    // ========================== AUTH ==========================
    if (!auth) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [bearer, token] = auth.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {

      // ========================== VERIFY TOKEN ==========================      
      const data = this.jwt.verify(token, {
        secret: config.TOKEN.ACCESS_KEY,
      });
      
      // ========================== CHECK TOKEN ==========================
      
      if (!data?.is_active) {
        throw new ForbiddenException('User is not active');
      }

    // ========================== PING REQ USER ==========================
      request.user = data;
      
      return true;
      
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
