import { AppError } from '../../errors/AppError.js'
import Crypt from '../../utils/Crypt.js'
import { successRes } from '../../utils/success-create.js'
import { BaseController } from './base.controller.js'
import Token from '../../utils/Token.js'
import config from '../../config/server.config.js'

export class UserController extends BaseController {
    constructor(modelUser) {
        super(modelUser)
        this.modelUser = modelUser
    }
    createUser = (...role) => {
        return async (req, res, next) => {
            try {
                const { username, email, password } = req.body
                //username bor yoki yoqligini aniqlavomiza!
                const existsUsername = await this.modelUser.findOne({ username })
                if (existsUsername) {
                    throw new AppError(`this ${username} username already added`)
                }
                //email bor yoki yoqligini aniqlavomiza!
                const existsEmail = await this.modelUser.findOne({ email })
                if (existsEmail) {
                    throw new AppError(`this ${username} email already added`)
                }
                //Faqat ruxsat etilgan foydalanuvchilar create qila olishini aniqlanadi!
                if (!role.includes(req.user.role)) {
                    throw new AppError('Not access create new admin', 403)
                }

                //paroli hash lanadi bcrypt orqali
                req.body.hashPassword = await Crypt.encrypt(password)
                //req.body paroli o'chirib tashlanadi
                delete req.body.password
                //create qilinvoti databasaga
                const result = await this.modelUser.create(req.body)
                successRes(res, result, 201)
            } catch (error) {
                next(error)
            }
        }
    }

    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            //email bor yoki yoqligini aniqlavomiza!
            const user = await this.modelUser.findOne({ email })
            if (!user) {
                throw new AppError('Email or password incorrect', 401)
            }
            //parol t'ogri ekanligini aniqlavomiza!
            const hashPassword = await Crypt.decrypt(password, user.hashPassword);
            if (!hashPassword) {
                throw new AppError('Email or password incorrect', 401)
            }
            // token ga data bervomiza
            const payload = {
                id: user._id, isActive: user.isActive, role: user.role
            }

            //access token ovomiza
            const access = Token.accessToken(payload);
            //refresh token ovomiza
            const refresh = Token.refreshToken(payload);
            // cookie ga refresh tokini yozib qoyvomiza
            Token.writeCookie(res, 'refreshToken', refresh, 30);
            //return qilinvoti frontend ga
            return successRes(res, {
                token: access,
                data: user
            })

        } catch (error) {
            next(error)
        }
    }

    newToken = async (req, res, next) => {
        try {
            //cookie ichidagi refresh tokeni tekshiramiza tayor funksiya orqali
            const refresh = req.cookies?.refreshToken
            const admin = await this.checkToken(refresh)
            // Yangi Token ga payload bermiza
            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }
            const access = Token.accessToken(payload)
            successRes(res, access)
        } catch (error) {
            next(error)
        }
    }

    signOut = async (req, res, next) => {
        try {
            //cookie ichidagi refresh tokeni tekshiramiza tayor funksiya orqali
            const refresh = req.cookies?.refreshToken
            await this.checkToken(refresh)
            // cookie ichidagi refreshToken tokenini tozlab tashiymiza
            res.clearCookie('refreshToken');
            successRes(res, {})
        } catch (error) {
            next(error)
        }
    }
    updateAdmin = async (req, res, next) => {
        try {
            // id boyicha user qidiramiza
            const id = req.params?.id
            const user = await BaseController.checkByID(id, Admin);
            if (!user) {
                throw new AppError('Not found user', 404)
            }
            //email va username bor tekshiramiza agar bor bolsa Error ga otib yubormiza
            const { email, password, username } = req.body
            const existsEmail = await Admin.findOne({ email })
            if (existsEmail) {
                throw new AppError(`This ${email} alread added`)
            }
            const existsUsername = await Admin.findOne({ username })
            if (existsUsername) {
                throw new AppError(`This ${username} alread added`)
            }
            let hashPassword = user.hashPassword
            if (password) {
                if (req.user.role !== user.role) {
                    //Paroli faqat Admin update qila olish kerak
                    throw new AppError('Nor access to change password for user', 403)
                }
                req.body.hashPassword = await Crypt.encrypt(password)
                //eski paroli delete qilib tashaymiza
                delete req.body.password
            }
            const updateAdmin = await Admin.findOneAndUpdate(id, req.body, { new: true })
            return successRes(res, updateAdmin)
        } catch (error) {
            next(error)
        }
    }

    updateAdminPassword = async (req, res, next) => {
        try {
            // id boyicha Admin qidiramiza
            const id = req.params?.id
            const admin = await BaseController.checkByID(id, Admin);
            if (!admin) {
                throw new AppError('Not found user', 404)
            }
            const { oldPassword, newPassword } = req.body
            // eski parol torimi yoki yoqligini tekshiramiza
            const checkPassword = await Crypt.decrypt(oldPassword, admin.hashPassword)
            if (!checkPassword) {
                throw new AppError('Incorrect old Password', 409)
            }
            // yangi parol hash lab jonatib yubormiza
            const hashPassword = await Crypt.encrypt(newPassword);
            const updatePassword = await Admin.findOneAndUpdate(id, hashPassword, { new: true });
            successRes(res, updatePassword)
        } catch (error) {
            next(error)
        }
    }
    checkToken = async (refresh) => {
        //Refresh tokeni bor yoqligini tekshirmiza
        if (!refresh) {
            throw new AppError('Authorization error', 401)
        }
        // Refresh tokeni hali ham mudadi tugamagnini aniqlaymiza
        const verifyToken = Token.verifyToken(refresh, config.TOKEN.REFRESH_KEY)
        if (!verifyToken) {
            throw new AppError('Refresh token expire', 401)
        }
        // token ichidagi id boyicha admin qidiramiza
        const user = await this.modelUser.findById(verifyToken.id)
        if (!user) {
            throw new AppError('Forbiden user', 403)
        }
        return user
    }
}
