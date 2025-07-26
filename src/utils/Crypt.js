import bcrypt from 'bcrypt'

class Crypt {
    encrypt = async (data) => {
        const result = await bcrypt.hash(data, 7)
        return result
    }
    decrypt = async (date, hashpassword) => {
        const result = await bcrypt.compare(date, hashpassword)
        return result
    }
}

export default new Crypt();