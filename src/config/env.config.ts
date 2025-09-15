import dotenv from 'dotenv';
dotenv.config();

type ConfigType = {
  PORT: number;
  APP_URL: string;

  DB_URL: string;
  DB_SYNC: boolean;

  SUPERADMIN: {
    PASSWORD: string;
    USERNAME: string;
    NAME: string;
    ID: number;
  };

  TOKEN: {
    ACCESS_KEY: string;
    ACCESS_TIME: string;

    REFRESH_KEY: string;
    REFRESH_TIME: string;
  };
  REDIS: {
    HOST: string;
    PORT: number;
    PASSWORD: string;
    TIME: number;
  };

  TELEGRAM: {
    TOKEN: string;
  };

  OTP: {
    NUMBER: number;
    TIME: number;
  };

  UPDATE_URL: string;
};

export const config: ConfigType = {
  PORT: Number(process.env.PORT),
  APP_URL: String(process.env.APP_URL),
  DB_URL:
    String(process.env.NODE_ENV) == 'dev'
      ? String(process.env.DEV_DB_URL)
      : String(process.env.PROD_DEV_URL),
  DB_SYNC: String(process.env.NODE_ENV) === 'dev' ? true : false,

  SUPERADMIN: {
    PASSWORD: String(process.env.ADMIN_PASSWORD),
    USERNAME: String(process.env.ADMIN_USERNAME),
    NAME: String(process.env.ADMIN_NAME),
    ID: Number(process.env.ADMIN_ID),
  },

  TOKEN: {
    ACCESS_KEY: String(process.env.ACCESS_TOKEN_KEY),
    ACCESS_TIME: String(process.env.ACCESS_TOKEN_TIME),

    REFRESH_KEY: String(process.env.REFRESH_TOKEN_KEY),
    REFRESH_TIME: String(process.env.REFRESH_TOKEN_TIME),
  },
  REDIS: {
    HOST: String(process.env.REDIS_HOST),
    PORT: Number(process.env.REDIS_PORT),
    PASSWORD: String(process.env.REDIS_PASSWORD),
    TIME: Number(process.env.REDIS_TIME),
  },

  TELEGRAM: {
    TOKEN: String(process.env.TELEGRAM_TOKEN),
  },

  OTP: {
    NUMBER: Number(process.env.OTP_NUMBER),
    TIME: Number(process.env.OTP_TIME),
  },

  UPDATE_URL: String(process.env.UPDATE_URL),
};
