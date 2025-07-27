import Joi from "joi";

const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernameReg = /^[a-zA-Z0-9_]{3,30}$/
const phoneReg = /^\+998(9[012345789]|33)\d{7}$/

class customerValidate {
    create = () => {
        return Joi.object({
            username: Joi.string().required().min(3).pattern(usernameReg).max(100),
            email: Joi.string().required().pattern(emailReg).min(3).max(100),
            hashPassword: Joi.string().required().min(3),
            fullName: Joi.string().required().min(3).max(100).trim(),
            phoneNumber: Joi.string().required().pattern(phoneReg).trim(),
            isActive: Joi.boolean(),
            role: Joi.valid('Customer').optional(),
        })
    }

    update = () => {
        return Joi.object({
            username: Joi.string().optional().min(3).pattern(usernameReg).max(100),
            email: Joi.string().optional().pattern(emailReg).min(3).max(100),
            hashPassword: Joi.string().optional().min(3),
            fullName: Joi.string().optional().min(3).max(100).trim(),
            phoneNumber: Joi.string().optional().pattern(phoneReg).trim(),
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

export default new customerValidate();