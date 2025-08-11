import { AppError } from "../error/AppError.js";

export const validate = (schema) => {
    return (req, _res, next) => {
        try {
            const validSchema = schema()
            const { error } = validSchema.validate(req.body)
            if (error) {
                throw new AppError(error?.details[0].message ?? 'Error input validation', 403)
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}