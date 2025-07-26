import { isValidObjectId } from "mongoose";
import { successRes } from '../utils/success-create.js'
import { AppError } from "../errors/AppError.js";

export class BaseController {
    constructor(model) {
        this.model = model
    }
    create = async (req, res, next) => {
        try {
            const result = await this.model.create(req.body)
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    getAll = async (_, res, next) => {
        try {
            const result = await this.model.find();
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    getByID = async (req, res, next) => {
        try {
            const id = req.params.id
            const result = await this.checkByID(id)
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.id
            await this.checkByID(id)
            const result = this.model.findByIdAndUpdate(id, req.body)
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.id
            await this.checkByID(id)
            const result = this.model.findByIdAndDelete(id, req.body)
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
    static checkByID = async (id, schema) => {
        if (isValidObjectId(id)) {
            throw new AppError('Invalid ObjectId', 400)
        }
        const model = schema || this.model
        const admin = await model.findById(id);
        if (!admin) {
            throw new AppError('Not found user', 404)
        }
        return admin
    }
}

