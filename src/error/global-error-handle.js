import logger from "./Winston.js";
export const globalError = (err, _req, res, _next) => {
    console.log('Error handle: ', err.message);
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';
    const stack = err.stack ?? 'Not found folder :(';
    if (statusCode.toString().startsWith('5')) {
        logger.error(`ERROR: ${message} STATUS:${statusCode} FOLDER:`)
    }
    return res.status(statusCode).json({
        statusCode,
        message,
        // stack
    })
}