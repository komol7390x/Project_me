import Joi from "joi";

const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernameReg = /^[a-zA-Z0-9_]{3,30}$/

class adminValidate {
    create = () => {
        return Joi.object({
            username: Joi.string().required().min(3).pattern(usernameReg).max(100),
            email: Joi.string().required().pattern(emailReg).min(3).max(100),
            password: Joi.string().required().min(3),
            isActive: Joi.boolean(),
            role: Joi.valid('ADMIN').optional(),
        })
    }

    update = () => {
        return Joi.object({
            username: Joi.string().optional().min(3).pattern(usernameReg).max(100),
            email: Joi.string().optional().pattern(emailReg).min(3).max(100),
            password: Joi.string().optional().min(3),
            isActive: Joi.boolean(),
        })
    }

    signin = () => {
        return Joi.object({
            email: Joi.string().required(),
            hashPassword: Joi.string().required()
        })
    }

    password = () => {
        return Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required().min(3),
        })
    }
}

export default new adminValidate();