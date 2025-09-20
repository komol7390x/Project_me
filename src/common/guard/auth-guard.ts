import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { config } from "src/config/env-config";
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{

        // ----------------------- Authorization -----------------------

        const request = context.switchToHttp().getRequest()
        const auth = request.headers.authorization

        // check auth
        if (!auth) {
            throw new UnauthorizedException('Authorization missing header')
        }

        // get bearer and token
        const [bearer, token] = auth.split(' ')
        if (bearer != 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid authorization format');
        }
        try {

            // verify token
            const data = this.jwt.verify(token, {
                secret: config.TOKEN.ACCESS_KEY
            })

            // no access if is_active false
            if (!data?.is_active) {
                throw new ForbiddenException('You cant access to enter')
            }

            // return success
            request.user = data
            return true
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            throw new UnauthorizedException('Token is invalid');
        }
    }
}
