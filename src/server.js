import app from "./app.js";
import consola from "consola";
import { connectDB, envConfig } from "./config/index.js";
import todoRouter from './routers/todo.route.js.js'
// PORT
const PORT = envConfig.port;

// Database'ga ulanishni tekshiruvchi funksiya
await connectDB();
app.use('/todo',todoRouter)

// Server listen
app.listen(PORT, () => {
  consola.success(`http://localhost:${PORT}`);
});
