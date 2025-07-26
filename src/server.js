import express from 'express'
import config from './config/server.config.js'
import { connectDB } from './databases/server.database.js'
import Router from './routers/index.route.js'
await connectDB()
const server = express()

server.use(express.json())
server.use('/', Router)

const PORT = +config.PORT || 5050

server.listen(PORT, () => console.log('Server is running PORT:', PORT))