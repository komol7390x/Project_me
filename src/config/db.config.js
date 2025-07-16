import { connect } from "mongoose";
import consola from "consola";

import { envConfig } from "./env.config.js";

export async function connectDB() {
  try {
    await connect(envConfig.mongoURI);
    consola.success("Database'ga muvaffaqiyatli ulandi");
  } catch (error) {
    consola.error(error.message);
    process.exit(1);
  }
}
