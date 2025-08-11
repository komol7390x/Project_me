import Joi from "joi";

class ProductValidate {
    create = () => {
        return Joi.object({
            name: Joi.string().required().min(3),
            price:Joi.number().min(0).required(),
            stockQuantity:Joi.number().min(0),
            image:Joi.string(),
            sallerID: Joi.string().required(),
            categoryID: Joi.string().required()
        })
    }

    update = () => {
        return Joi.object({
            name: Joi.string().optional().min(3),
            price:Joi.number().min(0).optional(),
            stockQuantity:Joi.number().min(0),
            image:Joi.string().optional(),
            sallerID: Joi.string().optional(),
            categoryID: Joi.string().optional()
        })
    }
}

export default new ProductValidate();