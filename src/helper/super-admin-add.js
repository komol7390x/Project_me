import config from '../config/server.config.js'
import { connectDB } from '../databases/server.database.js'
import { disconnect } from 'mongoose'
import { Admin } from '../models/admin.schema.js'
import Crypt from '../utils/Crypt.js'

(async function () {
    try {
        await connectDB()
        const isRole = await Admin.findOne({ role: 'SUPERADMIN' })
        if (isRole) {
            console.log('SUPERADMIN already added :(');
            return
        }
        const hashPassword = Crypt.encrypt(config.SUPERADMIN.password)
        const admin = {
            username: config.SUPERADMIN.username,
            email: config.SUPERADMIN.email,
            hashPassword,
            role: 'SUPERADMIN'
        }
        await Admin.create(admin)
        console.log('Admin is created :)');
        await disconnect()
    } catch (error) {
        console.log('Error create SUPERADMIN:', error.message)
    }
}())