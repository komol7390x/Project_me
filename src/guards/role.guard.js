import { AppError } from "../error/AppError.js";

export const RoleGuard = (...roles) => {
    return (req, _res, next) => {
        try {
            const role = req.user.role
            if ((role && roles.includes(role)) || (roles.includes('ID') && req.user.id == req.params.id)) {
                return next()
            }
            throw new AppError('Forbidden user', 403)
        } catch (error) {
            next(error)
        }
    }
}