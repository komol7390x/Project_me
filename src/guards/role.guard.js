import { AppError } from "../errors/AppError";

export const RoleGuard = (...roles) => {
    return async (req, _res, next) => {
        try {
            if (req.user?.role && roles.includes(req.user.role) ||
                (roles.includes(req.user.role) && req.params?.id === req.user?.id)) {
                return next()
            }
            throw new AppError('Forbiden user', 403)
        } catch (error) {
            next(error)
        }
    }
}