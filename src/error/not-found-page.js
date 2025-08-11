import { AppError } from "./AppError.js";

export const pageError = (req, _res, next) => {
    const messageError = req.url.split('/')[1] == 'uploads' ? 'File not found' : 'Page not found'
    throw next(new AppError(messageError, 404))
}