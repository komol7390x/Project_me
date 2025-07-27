import jwt from 'jsonwebtoken'
import config from '../config/server.config.js'

class Token {
    accessToken = (payload) => {
        return jwt.sign(payload, config.TOKEN.ACCESS_KEY, {
            expiresIn: config.TOKEN.ACCESS_TIME
        })
    }
    refreshToken = (payload) => {
        return jwt.sign(payload, config.TOKEN.REFRESH_KEY, {
            expiresIn: config.TOKEN.REFRESH_TIME
        })
    }

    writeCookie = async (res, key, value, expireDay) => {
        await res.cookie(key, value, {
            httpOnly: true,
            secure: true,
            maxAge: Number(expireDay) * 24 * 60 * 60 * 1000
        })
    }

    verifyToken = (data, secretKey) => {
        return jwt.verify(data, secretKey)
    }
}

export default new Token();