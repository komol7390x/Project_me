import { config } from "dotenv";
config();

export const envConfig = {
  port: +process.env.PORT || 3001,
  mongoURI: process.env.MONGO_URI,
};
