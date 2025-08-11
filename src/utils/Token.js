import jwt from 'jsonwebtoken'
import { configFile } from '../config/server.config.js'

export class Token {
    // access token olish
    accessToken = async (payload) => {
        return jwt.sign(payload, configFile.TOKEN.ACCESS_KEY, {
            expiresIn: configFile.TOKEN.ACCESS_TIME
        })
    }

    // refresh token olish
    refreshToken = async (payload) => {
        return jwt.sign(payload, configFile.TOKEN.REFRESH_KEY, {
            expiresIn: configFile.TOKEN.REFRESH_TIME
        })
    }

    // cookie yoziib qoyish
    writeCookie = async (res, key, value, time) => {
        res.cookie(key, value, {
            httpOnly: true,
            secure: true,
            maxAge: Number(time) * 60 * 60 * 1000
        })
    }

    // token verify qilish
    verifyToken =async (token, secretKey) => {
        return jwt.verify(token, secretKey)
    }
}

export default new Token();