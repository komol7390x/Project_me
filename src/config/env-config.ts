import dotenv from 'dotenv'
dotenv.config()

type ConfigType = {
    PORT: number,
    API_URL: string
    API_VERSION: string,
    DB_URL: string,

    TOKEN: {
        ACCESS_KEY: string
        ACCESS_TIME: string,

        REFRESH_KEY: string,
        REFRESH_TIME: string
    },
    SUPERADMIN: {
        EMAIL: string,
        PASSWORD: string,
        USERNAME: string,
        ID: number,
        FULL_NAME:string
    },
    OTP_NUMBER:number,
    UPDATE_URL:string,

    BOT_TOKEN:string

    BORROW_TIME:number
}

export const config: ConfigType = {
    PORT: Number(process.env.PORT),
    API_URL: String(process.env.API_URL),
    API_VERSION: String(process.env.API_VERSION),
    DB_URL: String(process.env.DB_URL),

    TOKEN: {
        ACCESS_KEY: String(process.env.ACCESS_TOKEN_KEY),
        ACCESS_TIME: String(process.env.ACCESS_TOKEN_TIME),

        REFRESH_KEY: String(process.env.REFRESH_TOKEN_KEY),
        REFRESH_TIME: String(process.env.REFRESH_TOKEN_TIME)
    },
    SUPERADMIN: {
        PASSWORD: String(process.env.SUPERADMIN_PASSWORD),
        EMAIL: String(process.env.SUPERADMIN_EMAIL),
        USERNAME: String(process.env.SUPERADMIN_USERNAME),
        ID: Number(process.env.SUPERADMIN_ID),
        FULL_NAME:String(process.env.SUPERADMIN_FULL_NAME)
    },
    OTP_NUMBER:Number(process.env.OTP_NUMBER),
    UPDATE_URL:String(process.env.UPDATE_URL),

    BOT_TOKEN:String(process.env.BOT_TOKEN),

    BORROW_TIME:Number(process.env.BORROW_TIME)
}


