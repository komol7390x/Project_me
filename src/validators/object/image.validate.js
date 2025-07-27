import Joi from "joi";

class categoryValidate {
    create = () => {
        return Joi.object({
            url: Joi.string().required().min(3),
            productID: Joi.string().required().min(3),
        })
    }

    update = () => {
        return Joi.object({
            productID: Joi.string().required().min(3),
            url: Joi.string().optional().min(3),
        })
    }
}

export default new categoryValidate();