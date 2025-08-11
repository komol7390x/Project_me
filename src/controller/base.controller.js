import { isValidObjectId } from "mongoose";
import { AppError } from '../error/AppError.js'
import { successRes } from "../utils/successRes.js";

export class BaseController {
    constructor(model, populateFields = []) {
        this.model = model
        this.populateFields = populateFields
    }
    //=========================== CREATE ===========================
    create = async (req, res, next) => {
        try {
            const result = await this.model.create(req.body)
            successRes(res, result, 201)
        } catch (error) {
            next(error)
        }
    }

    //=========================== GET ALL ===========================
    getAll = async (_req, res, next) => {
        try {
            let query = this.model.find();
            if (this.populateFields.length > 0) {
                this.populateFields.forEach(field => {
                    query = query.populate(field);
                });
            }
            const result = await query.exec();
            successRes(res, result);
        } catch (error) {
            next(error)
        }
    }

    //=========================== GET BY ID ===========================
    getById = async (req, res, next) => {
        try {
            const id = req.params.id
            await BaseController.checkById(id, this.model);
            let query = this.model.findById(id);
            if (this.populateFields.length > 0) {
                this.populateFields.forEach(field => {
                    query = query.populate(field);
                });
            }
            const result = await query.exec();
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }

    //=========================== UPDATE ===========================
    update = async (req, res, next) => {
        try {
            const id = req.params.id
            await BaseController.checkById(id, this.model);
            const result = await this.model.findByIdAndUpdate(id, req.body, { new: true })
            successRes(res, result)
        } catch (error) {
            next(error)
        }
    }

    //=========================== DELETE ===========================
    delete = async (req, res, next) => {
        try {
            const id = req.params.id
            await BaseController.checkById(id, this.model);
            await this.model.findByIdAndDelete(id)
            successRes(res, {})
        } catch (error) {
            next(error)
        }
    }
    //=========================== CHECK BY ID ===========================
    static checkById = async (id, schema) => {

        if (!isValidObjectId(id)) {
            throw new AppError(`this ${id} is invalid`, 400)
        }
        const result = await schema.findById(id)
        if (!result) {
            throw new AppError(`this ${id} user not found`, 404)
        }
        return result
    }
}