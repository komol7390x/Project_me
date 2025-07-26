export const successRes = async (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        statusCode,
        message: 'success',
        data
    })
}