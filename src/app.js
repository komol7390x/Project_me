import express from "express";
import path from "path";

import { pageRouter } from "./routers/index.js";

// Application
const app = express();

// Satic fayllarni yuboruvchi middleware
app.use(express.static(path.join(process.cwd(), "public")));

// EJS'ni sozlash
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

// EJS' route
app.use("/", pageRouter);

export default app;
