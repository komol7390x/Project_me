import { Router } from "express";

import controller from '../../controller/clients/customer.controller.js'
import Validation from "../../validation/clients/customer.validate.js";

import { validate } from "../../middleware/validate.middle.js";
import { requestLimiter } from "../../utils/req-limiter.js";
import { configFile } from '../../config/server.config.js'
import { RoleGuard } from "../../guards/role.guard.js";
import { AuthGuard } from "../../guards/auth.guard.js";
import { Role } from "../../const/Role.js";

const router = Router()

router
    // =============== POST ===============
    .post('/register',
        validate(Validation.create),
        controller.registerCustomer)

    .post('/confirm-otp',
        validate(Validation.confirmOTP),
        controller.confirmOTP)

    .post(`/${configFile.OTP.REGISTER_URL}`,
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        validate(Validation.confirmOTP),
        controller.confirmRegisterMail)

    .post('/signin',
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        validate(Validation.signIn),
        controller.signIn)

    .post('/forget-password',
        validate(Validation.forgetPassword),
        controller.forgetPassword)

    // =============== GET ===============
    .get('/signout',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, Role.CUSTOMER),
        controller.signOut)

    .get('/newtoken/:id',
        controller.newToken)

    .get('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        controller.getAll)

    .get('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        controller.getById)
    // =============== PATCH ===============

    .patch(`/${configFile.OTP.PASSWORD_URL}`,
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        validate(Validation.updatePassword),
        controller.updatePassword)

    .patch('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        validate(Validation.update),
        controller.update)
    // =============== DELETE ===============

    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        controller.delete)


export default router