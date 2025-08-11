import Crypt from '../../utils/Crypt.js'

import { UserController } from "../user.controller.js";
import { Admin } from '../../model/client/admin.model.js'
import { AppError } from "../../error/AppError.js";
import { successRes } from "../../utils/successRes.js";

class AdminController extends UserController {
    constructor() {
        super(Admin)
    }
    //=================== CREATE ADMIN ===================\\
    createAdmin = async (req, res, next) => {
        try {
            const { username, email, password } = req.body
            const existEmail = await Admin.findOne({ email })
            if (existEmail) {
                throw new AppError('Email already added', 409)
            }
            const existUsername = await Admin.findOne({ username })
            if (existUsername) {
                throw new AppError('Username already added', 409)
            }
            req.body.hashPassword = await Crypt.encrypt(password)
            delete req.body.password
            const result = await Admin.create(req.body);
            successRes(res, result, 201)

        } catch (error) {
            next(error)
        }
    }
    //=================== UPDATE ADMIN ===================\\
    updateAdmin = async (req, res, next) => {
        try {            
            const id = req.params?.id
            const admin = await UserController.checkById(id, Admin)
            const { email, username, password } = req.body
            if (email) {
                const existEmail = await Admin.findOne({ email })
                if (existEmail && existEmail.email != email) {
                    throw new AppError('Email already added', 409)
                }
            }
            if (username) {
                const existUsername = await Admin.findOne({ username })
                if (existUsername && existUsername.username != username) {
                    throw new AppError('Username already added', 409)
                }
            }
            if (password) {
                if (req.user.role !== admin.role) {
                    throw new AppError(`Only ${admin.role} is updated`, 403)
                }
                req.body.hashPassword = await Crypt.encrypt(password)
                delete req.body.password
            }
            const updateAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true })
            successRes(res, updateAdmin)
        } catch (error) {
            next(error)
        }
    }
   
}

export default new AdminController()