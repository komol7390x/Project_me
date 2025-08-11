import { connect } from 'mongoose'
import { configFile } from '../config/server.config.js';

export const connectDB = async () => {
    try {
        await connect(configFile.MONGODB_URL)
        console.log('Server is connect to Database');

    } catch (error) {
        console.log('Error connect database', error.message)
        process.exit(1)
    }
}