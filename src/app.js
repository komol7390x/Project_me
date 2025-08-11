import express from "express"
import helmet from "helmet"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { connectDB } from './database/database.mongodb.js'
import { globalError } from "./error/global-error-handle.js"
import Routers from './routers/index.route.js'
import { join } from "path"

export const allFunction = async (server) => {

    await connectDB()

    server.use(express.json())
    server.use(cookieParser())
    server.use(helmet())

    server.use(cors({ origin: '*' }))
    server.use('/uploads',express.static(join(process.cwd(),'uploads')))

    server.use('/api', Routers)

    server.use(globalError)
}