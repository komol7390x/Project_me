import { createClient } from "redis";
import { configFile } from '../config/server.config.js'

export const redisDB = createClient({
    //options
    socket: {
        host: configFile.REDIS.HOST,
        port: configFile.REDIS.PORT,
    },
    password: configFile.REDIS.PASSWORD
})

redisDB.on('error', () => console.log('Error connect REDIS :('))

await redisDB.connect()
console.log('Redis connected');
