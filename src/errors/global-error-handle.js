export const globalError = (err, _req, res, _next) => {
    console.log('Global Error: ', err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Inrernal server error'
    return res.status(statusCode).json({
        statusCode,
        message
    })
}