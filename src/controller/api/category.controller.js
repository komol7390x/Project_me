import fs from 'fs'

import { BaseController } from "../base.controller.js";

import { AppError } from "../../error/AppError.js";
import { successRes } from "../../utils/successRes.js";
import { modelConfig } from '../../config/model.config.js';

import { Category } from '../../model/api/category.model.js'

class CategoryController extends BaseController {
    constructor() {
        super(Category, [modelConfig.REFERENS.PRODUCT])
    }
    createCategory = async (req, res, next) => {
        try {
            const { name } = req.body
            const exists = await Category.findOne({ name })
            if (exists) {
                throw new AppError(`this ${name} already create on Category`)
            }
            req.body.image = '/uploads' + req.file?.path.split('uploads')[1]
            const result = await Category.create(req.body)
            return successRes(res, result, 201)
        } catch (error) {
            if (req.file?.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkErr) {
                    console.error("error to delete file :( ", unlinkErr.message);
                }
            }
            next(error)
        }
    }

    updateCategory = async (req, res, next) => {
        try {
            const id = req.params.id
            const { name } = req.body
            const exists = await Category.findOne({ name })
            if (exists) {
                throw new AppError(`this ${name} already create on Category`)
            }
            await BaseController.checkById(id, Category)
            const result = await Category.findByIdAndUpdate(id, req.body, { new: true })
            return successRes(res, result)
        } catch (error) {
            next(error)
        }
    }
}

export default new CategoryController()