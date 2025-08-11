import winston from "winston";

const customeTime = winston.format((info) => {
    const data = new Date()
    info.timestamp = data.toLocaleString('en-GB', { timeZone: 'Asia/Tashkent', hour12: false })
    return info
})

const info = winston.format((info) => {
    return info.level == 'info' ? info : false
})

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({
            filename: 'logs/info.log', level: 'info',
            format: winston.format.combine(info())
        }),
        new winston.transports.File({ filename: 'logs/combine.log' })
    ],
    format: winston.format.combine(
        customeTime(),
        winston.format.prettyPrint()
    )
})

export default logger