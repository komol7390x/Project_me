import { AppError } from '../errors/AppError.js'
import { Admin } from '../models/index.schema.js'
import Crypt from '../utils/Crypt.js'
import { successRes } from '../utils/success-create.js'
import { BaseController } from './index.controller.js'
import Token from '../utils/Token.js'

class AdminController extends BaseController {
    constructor() {
        super(Admin)
    }
    createAdmin = async (req, res, next) => {
        try {
            const { username, email, password } = req.body
            //username bor yoki yoqligini aniqlavomiza!
            const existsUsername = await Admin.findOne({ username })
            if (existsUsername) {
                throw new AppError(`this ${username} username already added`)
            }
            //email bor yoki yoqligini aniqlavomiza!
            const existsEmail = await Admin.findOne({ email })
            if (existsEmail) {
                throw new AppError(`this ${username} email already added`)
            }
            //SUPERADMIN create qilvotganini aniqlavomiza!
            if (req.user.role !== 'SUPERADMIN') {
                throw new AppError('Not access create new admin', 403)
            }
            //paroli hash lavomiza bcrypt orqali
            const hashPassword = await Crypt.encrypt(password)
            //req.body parili o'chirib tashlavoti
            delete req.body.password
            //create qilivoti databasaga
            const result = await Admin.create(...req.body, hashPassword)
            successRes(res, result, 201)
        } catch (error) {
            next(error)
        }
    }

    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email })
            if (!admin) {
                throw new AppError('Email or password incorrect', 401)
            }
            const hashPassword = await Crypt.decrypt(password, admin.hashPassword);
            if (!hashPassword) {
                throw new AppError('Email or password incorrect', 401)
            }
            const payload = {
                id: admin._id, isActive: admin.isActive, role: admin.role
            }
            const access = Token.accessToken(payload);
            const refresh = Token.refreshToken(payload);
            Token.writeCookie(res, 'refreshToken', refresh, 30);
            return successRes(res, {
                token: access,
                data: admin
            })

        } catch (error) {
            next(error)
        }
    }

    newToken = async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    }

    signOut = async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    }
}

export default new AdminController();