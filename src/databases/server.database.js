import { connect } from 'mongoose'
import config from '../config/server.config.js'
export const connectDB = async () => {
    try {
        await connect(config.MONGODB_URL);
        console.log('Server is connect Database');
    } catch (error) {
        console.log('Error connect database', error.message);
        process(1)
    }
}

