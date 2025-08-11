import Joi from "joi";

class PaymentValidate {
    create = () => {
        return Joi.object({
            status: Joi.boolean(),
            secretKey: Joi.string().required(),
            access: Joi.boolean().required()
        })
    }

    update = () => {
        return Joi.object({
            access: Joi.boolean().required(),
            secretKey: Joi.string(),
        })
    }
}

export default new PaymentValidate();