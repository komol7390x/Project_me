import Crypt from "../../utils/Crypt.js";

import { UserController } from "../user.controller.js";
import { Saller } from '../../model/client/saller.model.js'
import { successRes } from "../../utils/successRes.js";
import { AppError } from "../../error/AppError.js";

class SallerController extends UserController {
    constructor() {
        super(Saller, ['WalletRef', 'ProductRef'])
    }
    //=================== CREATE SALLER ===================\\

    createSaller = async (req, res, next) => {
        try {

            const { fullName, email, phoneNumber, password } = req.body
            const existEmail = await Saller.findOne({ email })

            if (existEmail) {
                throw new AppError('Email already added', 409)
            }

            const existFullName = await Saller.findOne({ fullName })
            if (existFullName) {
                throw new AppError('fullName already added', 409)
            }

            const existPhoneNumber = await Saller.findOne({ phoneNumber })
            if (existPhoneNumber) {
                throw new AppError('phone Number already added', 409)
            }

            req.body.hashPassword = await Crypt.encrypt(password)
            delete req.body.password
            const result = await Saller.create(req.body);
            successRes(res, result, 201)

        } catch (error) {
            next(error)
        }
    }
}

export default new SallerController()