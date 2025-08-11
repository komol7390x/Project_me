import { configFile } from "../config/server.config.js";
import { AppError } from "../error/AppError.js";
import Token from "../utils/Token.js";

export const AuthGuard = async (req, res, next) => {
    try {
        const auth = req.headers?.authorization
        if (!auth) {
            throw new AppError('Header authorization is Error', 403)
        }
        const bearer = auth.split(' ')[0]
        const authToken = auth.split(' ')[1]
        if (bearer != 'Bearer' || !authToken) {
            throw new AppError('Authorization is Error', 403)
        }
        req.user = await Token.verifyToken(authToken, configFile.TOKEN.ACCESS_KEY)
        next()
    } catch (error) {
        next(error)
    }
}