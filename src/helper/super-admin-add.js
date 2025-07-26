import config from '../config/server.config.js'
import { connectDB } from '../databases/server.database.js'
(async function () {
    try {
        await connectDB()
        const admin = {
            username: config.SUPERADMIN.username,
            email: config.SUPERADMIN.email,
            password: config.SUPERADMIN.password
        }
        // await /
    } catch (error) {
        console.log('Error create SUPERADMIN:', error.message)
    }
}())