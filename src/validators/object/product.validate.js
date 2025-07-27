import Joi from "joi";

class productValidate {
    create = () => {
        return Joi.object({
            name: Joi.string().required().min(3),
            price: Joi.number().required().min(3),
            quantity: Joi.number().required().min(3),
            description: Joi.string().optional(),
            sallerID: Joi.string().required().min(3),
            categoryID: Joi.string().required().min(3),
        })
    }

    update = () => {
        return Joi.object({
            name: Joi.string().optional().min(3),
            price: Joi.number().optional().min(3),
            quantity: Joi.number().optional().min(3),
            description: Joi.string().optional(),
            sallerID: Joi.string().optional().min(3),
            categoryID: Joi.string().optional().min(3),
        })
    }
}

export default new productValidate();