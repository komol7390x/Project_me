import Joi from 'joi'

export const UserSchema=Joi.object({
    email:Joi.string().required().max(100),
    password:Joi.string().required(),
    fullName:Joi.string(),
    description:Joi.string(),
    image_url:Joi.string()
})