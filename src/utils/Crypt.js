import { hash, compare, genSalt } from 'bcrypt'

class Crypt {
    encrypt = async (password) => {
        const salt = await genSalt(7)
        return await hash(password, salt)
    }
    decrypt = async (password, hashPassword) => {
        const result = await compare(password, hashPassword)
        return result
    }
}

export default new Crypt();