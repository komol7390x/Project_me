import Joi from "joi";

class Wallet {
    // ================== CUSTOMER ==================
    createCustomer = () => {
        return Joi.object({
            cardNumber: Joi.string().required().length(16),
            balance: Joi.number().required(),
            customerID: Joi.string()
        })
    }

    updateCustomer = () => {
        return Joi.object({
            cardNumber: Joi.string().optional().length(16),
            balance: Joi.number().required(),
            customerID: Joi.string().optional()
        })
    }
    // ================== SALLER ==================
    createSaller = () => {
        return Joi.object({
            cardNumber: Joi.string().required().length(16),
            balance: Joi.number().required(),
            sallerID: Joi.string()
        })
    }

    updateSaller = () => {
        return Joi.object({
            cardNumber: Joi.string().optional().length(16),
            balance: Joi.number().required(),
            sallerID: Joi.string().optional()
        })
    }

    cardSaller = () => {
        return Joi.object({
            sallerID: Joi.string().required(),
            cardNumber: Joi.string().required(),
            cash: Joi.string().required().min(0)
        })
    }

    cardCustomer = () => {
        return Joi.object({
            customerID: Joi.string().required(),
            cardNumber: Joi.string().required(),
            cash: Joi.string().required().min(0)
        })
    }
}

export default new Wallet()