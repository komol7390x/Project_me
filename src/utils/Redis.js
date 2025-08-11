import { redisDB } from "../database/redis.database.js";

class Redis {
    setDate = async (key, value, time = 300) => {
        return redisDB.set(key, value, {
            EX: time
        })
    };
    getDate=async(key)=>{
        return redisDB.get(key,)
    }

    deleteDate=async(key)=>{
        return redisDB.del(key)
    }
}

export default new Redis()