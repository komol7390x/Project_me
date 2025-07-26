import { config } from 'dotenv'
config()

export default {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    TOKEN: {
        ACCESS_KEY: process.env.ACCESS_KEY,
        ACCESS_TIME: process.env.ACCESS_TIME,

        REFRESH_KEY: process.env.REFRESH_KEY,
        REFRESH_TIME: process.env.REFRESH_TIME
    },
    SUPERADMIN: {
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD,
        username: process.env.SUPERADMIN_USERNAME
    }
}