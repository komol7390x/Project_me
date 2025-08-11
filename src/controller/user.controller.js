import Crypt from '../utils/Crypt.js'
import Token from '../utils/Token.js'
import Redis from "../utils/Redis.js";

import { BaseController } from "./base.controller.js";

import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/successRes.js";

import { generateOTP } from "../utils/generate-number.js";
import { sendOTPToMail } from '../utils/Email.js'
import { configFile } from "../config/server.config.js";

export class UserController extends BaseController {
    constructor(Clients, populateFields) {
        super(Clients, populateFields)
        this.Clients = Clients
    }

    //=================== UPDATE CLIENTS ===================\\
    updateClients = async (req, res, next) => {
        try {
            const id = req.params?.id
            const client = await UserController.checkById(id, this.Clients)
            const { email, fullName, phoneNumber, password } = req.body
            if (email) {
                const existEmail = await this.Clients.findOne({ email })
                if (existEmail && existEmail.email != email) {
                    throw new AppError('Email already added', 409)
                }
            }
            if (fullName) {
                const existFullName = await this.Clients.findOne({ fullName })
                if (existFullName && existFullName.fullName != fullName) {
                    throw new AppError('fullName already added', 409)
                }
            }
            if (phoneNumber) {
                const existPhoneNumber = await this.Clients.findOne({ phoneNumber })
                if (existPhoneNumber && existPhoneNumber.phoneNumber != phoneNumber) {
                    throw new AppError('existPhoneNumber already added', 409)
                }
            }
            if (password) {
                if (req.user.role !== client.role) {
                    throw new AppError(`Only ${client.role} is updated`, 403)
                }
                req.body.hashPassword = await Crypt.encrypt(password)
                delete req.body.password
            }
            const updateClient = await this.Clients.findByIdAndUpdate(id, req.body, { new: true })
            successRes(res, updateClient)
        } catch (error) {
            next(error)
        }
    }

    //=================== SIGN IN ===================\\
    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body                        
            const user = await this.Clients.findOne({ email })
            if (!user) {
                throw new AppError('Email or Password incorect', 409)
            }
            const checkPassword = await Crypt.decrypt(password, user?.hashPassword)
            if (!checkPassword) {
                throw new AppError('Email or Password incorect', 409)
            }
            const payload = {
                id: user._id, role: user.role, isActive: user.isActive
            }
            const access = await Token.accessToken(payload);
            const refresh = await Token.refreshToken(payload);
            await Token.writeCookie(res, 'refreshTokenUser', refresh, 30)
            successRes(res, {
                token: access,
                date: user
            })
        } catch (error) {
            next(error)
        }
    }

    //=================== SIGN OUT ===================\\
    signOut = async (req, res, next) => {
        try {
            await UserController.checkToken(req, this.Clients)
            res.clearCookie('refreshTokenUser')
            successRes(res, {})
        } catch (error) {
            next(error)
        }
    }

    //=================== NEW TOKEN ===================\\
    newToken = async (req, res, next) => {
        try {
            const id=req.params.id
            await BaseController.checkById(id,this.Clients)            
            const user = await UserController.checkToken(req, this.Clients);
            const payload = {
                id: user._id, role: user.role, isActive: user.isActive
            }
            const access = await Token.accessToken(payload);
            successRes(res, access)
        } catch (error) {
            next(error)
        }
    }

    //=================== FORGET PASSWORD ===================\\
    forgetPassword = async (req, res, next) => {
        try {
            const { email } = req.body
            const existEmail = await this.Clients.findOne({ email })
            if (!existEmail) {
                throw new AppError('Not found this email :(', 404)
            }
            const otp = generateOTP();
            await sendOTPToMail(email, otp)
            Redis.setDate(email, otp)
            return successRes(res, {
                email,
                expireDate: '5 minutes expire Date'
            })
        } catch (error) {
            next(error)
        }
    }

    //=================== CONFIRM PASSWORD ===================\\
    confirmOTP = async (req, res, next) => {
        try {
            const { email, otp } = req.body
            const existEmail = await this.Clients.findOne({ email })
            if (!existEmail) {
                throw new AppError('Not found this email :(', 404)
            }
            const resultOTP = await Redis.getDate(email)
            if (resultOTP != otp) {
                throw new AppError('OTP password is incorect', 403)
            }
            await Redis.deleteDate(email)
            return successRes(res, {
                email,
                url: configFile.OTP.PASSWORD_URL
            })

        } catch (error) {
            next(error)
        }
    }

    //=================== UPDATE PASSWORD ===================\\
    updatePassword = async (req, res, next) => {
        try {
            const { email, password } = req.body
            const user = await this.Clients.findOne({ email })
            if (!user) {
                throw new AppError('Not found this email :(', 404)
            }
            const hashPassword = await Crypt.encrypt(password)
            const result = await this.Clients.findByIdAndUpdate(user._id, { hashPassword }, { new: true })
            return successRes(res, result)
        } catch (error) {
            next(error)
        }
    }

    //=================== CHECK REFRESH TOKEN ===================\\
    static checkToken = async (req, schema) => {

        const refresh = req.cookies?.refreshTokenUser
        if (!refresh) {
            throw new AppError('Refresh token is not found', 401)
        }
        const verify = await Token.verifyToken(refresh, configFile.TOKEN.REFRESH_KEY);

        if (!verify) {
            throw new AppError('Refresh token is not verify', 401)
        }
        const user = await schema.findById(verify.id)
        if (!user) {
            throw new AppError(schema + ' is not found', 401)
        }
        return user
    }
}

export default new UserController()