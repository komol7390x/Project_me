import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IToken } from "./token-interface";
import { config } from "src/config/env-config";
import { Response } from "express";

@Injectable()
export class TokenService {
    constructor(private readonly jwt: JwtService) { }
// ---------------------------------- ACCESS ----------------------------------

    async accessToken(payload: IToken): Promise<string> {
        return this.jwt.signAsync(payload, { secret: config.TOKEN.ACCESS_KEY, expiresIn: config.TOKEN.ACCESS_TIME })
    }

    // ---------------------------------- REFRESH ----------------------------------

    async refreshToken(payload: IToken): Promise<string> {
        return this.jwt.signAsync(payload, { secret: config.TOKEN.REFRESH_KEY, expiresIn: config.TOKEN.REFRESH_TIME })
    }

    // ---------------------------------- COOKIE ----------------------------------

    async writeCookie(res: Response, key: string, value: string, time: number = 20): Promise<void> {
        
        res.cookie(key, value, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: Number(time) * 60 * 60 * 1000
        })
    }

    // ---------------------------------- VERIFY ----------------------------------

    async verifyToken(token: string, secret: string): Promise<object> {
        return this.jwt.verify(token, { secret })
    }
}