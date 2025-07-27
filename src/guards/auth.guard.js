import config from '../config/server.config.js'
import { AppError } from '../errors/AppError.js'
import Token from '../utils/Token.js'

export const AuthGuard = async (req, _res, next) => {
    try {
        const auth = req.headers?.authorization
        if (!auth) {
            throw new AppError('Authorization Error', 401);
        }
        const [bearer, authToken] = auth.split(' ')
        if (bearer !== 'Bearer' || !authToken) {
            throw new AppError('Unauthorized', 401);
        }
        const user = Token.verifyToken(authToken, config.TOKEN.ACCESS_KEY);
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}