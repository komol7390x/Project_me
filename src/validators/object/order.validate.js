import Joi from "joi";

class orderValidate {
    create = () => {
        return Joi.object({
            totalPrice: Joi.number().min(1),
            quantity: Joi.number().required().min(0),
            customerID: Joi.string().required().min(3),
            productID: Joi.string().required().min(3),
        })
    }

    update = () => {
        return Joi.object({
            totalPrice: Joi.number().min(1),
            quantity: Joi.number().optional().min(0),
            customerID: Joi.string().optional().min(3),
            productID: Joi.string().optional().min(3),
        })
    }
}

export default new orderValidate();