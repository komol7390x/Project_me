import Joi from 'joi'

export const todoSchema=Joi.object({
    task:Joi.string().required().min(2).max(100),
    done:Joi.boolean()
})