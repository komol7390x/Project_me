import Joi from "joi";
import { Role } from "../../const/Role.js";

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
const phoneReg = /^\+998\s?(9[0-9])\s?\d{3}\s?\d{2}\s?\d{2}$/

import { CustomerValidation } from "./customer.validate.js";

class SallerValidation extends CustomerValidation {

    createSaller = () => {
        return Joi.object({
            fullName: Joi.string().required().min(3).max(256),
            email: Joi.string().required().pattern(phoneReg),
            phoneNumber: Joi.string().required().pattern(emailReg),
            password: Joi.string().required().pattern(passwordReg),
            role: Joi.string().valid(Role.SALLER),
            device: Joi.array()
        })
    };

    updateSaller = () => {
        return Joi.object({
            fullName: Joi.string().optional().min(3).max(256),
            email: Joi.string().optional().pattern(phoneReg),
            phoneNumber: Joi.string().required().pattern(emailReg),
            password: Joi.string().optional().pattern(passwordReg),
            isActive: Joi.boolean(),
            role: Joi.string().valid(Role.SALLER),
            device: Joi.array()
        })
    };
}

export default new SallerValidation()