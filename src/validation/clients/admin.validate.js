import Joi from "joi";
import { Role } from "../../const/Role.js";

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

class AdminValidation {

    create = () => {
        return Joi.object({
            username: Joi.string().required().min(3).max(256),
            email: Joi.string().required().pattern(emailReg),
            password: Joi.string().required().pattern(passwordReg),
            isActive: Joi.boolean(),
            role: Joi.string().valid(Role.SUPERADMIN, Role.ADMIN),
            device: Joi.array()
        })
    };

    update = () => {
        return Joi.object({
            username: Joi.string().optional().min(3).max(256),
            email: Joi.string().optional().pattern(emailReg),
            password: Joi.string().optional().pattern(passwordReg),
            isActive: Joi.boolean(),
            role: Joi.string().valid(Role.SUPERADMIN, Role.ADMIN),
            device: Joi.array()
        })
    };

    signIn = () => {
        return Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    };

    forgetPassword = () => {
        return Joi.object({
            email: Joi.string().required(),
        })
    };

    confirmOTP=()=>{
        return Joi.object({
            email: Joi.string().required(),
            otp: Joi.string().required().length(6)
        })
    };

    updatePassword=()=>{
        return Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required().pattern(passwordReg)
        })
    }
}

export default new AdminValidation();