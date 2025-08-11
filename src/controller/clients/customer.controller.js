import Redis from "../../utils/Redis.js";
import Crypt from '../../utils/Crypt.js'

import { UserController } from "../user.controller.js";
import { Customers } from '../../model/client/customer.model.js'
import { generateOTP } from "../../utils/generate-number.js";
import { sendOTPToMail } from "../../utils/Email.js";
import { configFile } from "../../config/server.config.js";
import { AppError } from "../../error/AppError.js";
import { successRes } from "../../utils/successRes.js";

class CustomerController extends UserController {
    constructor() {
        super(Customers, ['OrderRef', 'WalletRef'])
    }

    //=================== CREATE SALLER ===================\\

    registerCustomer = async (req, res, next) => {
        try {
            const { fullName, email, phoneNumber, password } = req.body
            const existEmail = await Customers.findOne({ email })

            if (existEmail) {
                throw new AppError('Email already added', 409)
            }

            const existFullName = await Customers.findOne({ fullName })
            if (existFullName) {
                throw new AppError('fullName already added', 409)
            }

            const existPhoneNumber = await Customers.findOne({ phoneNumber })
            if (existPhoneNumber) {
                throw new AppError('phone Number already added', 409)
            }

            req.body.hashPassword = await Crypt.encrypt(password)
            delete req.body.password

            const otp = generateOTP()
            req.body.otp = otp

            Redis.setDate(email, JSON.stringify(req.body), 300)

            sendOTPToMail(email, otp)

            successRes(res, {
                url: configFile.OTP.REGISTER_URL,
                email,
                message: 'you have 5 minut for register'
            })
        } catch (error) {
            next(error)
        }
    };
    //=================== CONFIRM REGISTER ===================\\
    confirmRegisterMail = async (req, res, next) => {
        try {
            const { otp, email } = req.body
            const exist = await Customers.findOne({ email })
            if (exist) {
                throw new AppError(`this ${email} already is added on  users`, 404)
            }
            const customer = JSON.parse(await Redis.getDate(email))
            console.log(customer);
            if (!otp || otp != customer?.otp) {
                throw new AppError(`This OTP is incorect :(`, 404)
            }
            delete customer.otp
            Redis.deleteDate(email)
            customer.isActive = true
            const result = await Customers.create(customer)
            successRes(res, result, 201)
        } catch (error) {
            next(error)
        }
    }
}

export default new CustomerController()