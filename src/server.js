import app from "./app.js";
import consola from "consola";
import { connectDB, envConfig } from "./config/index.js";

// PORT
const PORT = envConfig.port;

// Database'ga ulanishni tekshiruvchi funksiya
await connectDB();

// Server listen
app.listen(PORT, () => {
  consola.success(`http://localhost:${PORT}`);
});
