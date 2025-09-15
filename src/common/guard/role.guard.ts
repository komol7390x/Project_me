import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req=context.switchToHttp().getRequest()
    if(requiredRole.includes(req.user.role)||(requiredRole.includes('ID') && req.user?.id==req.params.id))
      {
      return true
    }
    else{
      throw new ForbiddenException('Forbidden user')
    };
  }
}
