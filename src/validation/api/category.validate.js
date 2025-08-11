import Joi from "joi";

class CategoryValidate {
    create = () => {
        return Joi.object({
            name: Joi.string().required().min(3),
            image: Joi.string()
        })
    }
    update = () => {
        return Joi.object({
            name: Joi.string().optional().min(3),
            image: Joi.string().optional().min(3)
        })
    }
}

export default new CategoryValidate();