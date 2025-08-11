import { config } from "dotenv";
config()

export const configFile = {
    PORT: +process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,

    SUPERADMIN: {
        USERNAME: process.env.SUPERADMIN_USERNAME,
        EMAIL: process.env.SUPERADMIN_EMAIL,
        PASSWORD: process.env.SUPERADMIN_PASSWORD,
    },

    TOKEN: {
        ACCESS_KEY: process.env.ACCESS_TOKEN_KEY,
        ACCESS_TIME: process.env.ACCESS_TOKEN_TIME,
        REFRESH_KEY: process.env.REFRESH_TOKEN_KEY,
        REFRESH_TIME: process.env.REFRESH_TOKEN_TIME,
    },

    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT,
        PASSWORD: process.env.REDIS_PASSWORD,
    },
    GMAIL: {
        USER: process.env.GMAIL_USER,
        PASSWORD: process.env.GMAIL_PASSWORD

    },
    LIMITER: {
        LIMIT: process.env.REQUEST_LIMIT,
        SECONDS: process.env.REQUEST_SECONDS
    },
    OTP: {
        PASSWORD_URL: process.env.CONFIRM_PASSWORD_URL,
        REGISTER_URL: process.env.CONFIRM_REGISTER_URL,
    },

    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
    DEVICE_NUMBER: +process.env.DEVICE_NUMBER,
    PAYMENT: {
        CONFIRM_URL: process.env.CONFIRM_PAYMENT_URL,
        CONFIRM_PASSWORD: process.env.CONFIRM_PAYMENT_PASSWORD

    },
}