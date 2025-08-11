import Joi from "joi";

class OrderValidate {
    create = () => {
        return Joi.object({
            orderQuantity: Joi.number().required().min(0),
            customerID: Joi.string().required(),
            productID: Joi.string().required()
        })
    }

    update = () => {
        return Joi.object({
            orderQuantity: Joi.number().optional().min(0),
            customerID: Joi.string().optional(),
            productID: Joi.string().optional()
        })
    }
}

export default new OrderValidate();