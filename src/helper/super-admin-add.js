import config from '../config/server.config.js'
import { connectDB } from '../databases/server.database.js'
import { disconnect } from 'mongoose'
import { Admin } from '../models/users/admin.schema.js'
import Crypt from '../utils/Crypt.js'

(async function () {
    try {
        await connectDB()
        const isRole = await Admin.findOne({ role: 'SUPERADMIN' })
        if (isRole) {
            console.log('SUPERADMIN already added :(\nDatabase is disconnect');
            process.exit(1)
        }
        const hashPassword = await Crypt.encrypt(config.SUPERADMIN.password)
        const admin = {
            username: config.SUPERADMIN.username,
            email: config.SUPERADMIN.email,
            hashPassword,
            role: config.SUPERADMIN.role
        }
        await Admin.create(admin)
        console.log('Admin is created :)\nDatabase is disconnect');
        await disconnect()
        process.exit(1)
    } catch (error) {
        console.log('Error create SUPERADMIN:', error.message)
    }
}())