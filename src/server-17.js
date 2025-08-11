import express from "express";
import { configFile } from "./config/server.config.js";
import { allFunction } from "./app.js";

const server = express()

await allFunction(server)

const PORT = configFile.PORT

server.listen(PORT, () => console.log('Server is runing PORT:', PORT))

