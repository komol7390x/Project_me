import logger from "../error/Winston.js"

export const successRes = (res, data, statusCode = 200) => {
    if (statusCode == 201) {
        logger.info(`statusCode:${statusCode} data:${data}`)
    }
    res.status(statusCode).json({
        statusCode,
        message: 'success',
        data
    })
}