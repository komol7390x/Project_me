import { AppError } from '../errors/AppError.js'

export const validate = (SchemaValid) => {
    return async (req, res, next) => {
        try {
            const schema = SchemaValid()
            const { error } = await schema.validate(req.body);
            if (error) {
                throw new AppError(error?.details[0]?.message ?? 'Error input validation', 422)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}