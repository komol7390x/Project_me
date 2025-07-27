import { AppError } from "./AppError.js";

export const pageError = (_req, _res, next) => {
    throw next(new AppError('Page not found :('), 404)
}