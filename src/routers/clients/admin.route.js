import { Router } from "express";

import controller from '../../controller/clients/admin.controller.js'
import Validation from "../../validation/clients/admin.validate.js";

import { validate } from "../../middleware/validate.middle.js";
import { configFile } from '../../config/server.config.js'
import { AuthGuard } from "../../guards/auth.guard.js";
import { RoleGuard } from "../../guards/role.guard.js";
import { Role } from "../../const/Role.js";
import { requestLimiter } from "../../utils/req-limiter.js";

const router = Router()

router
    // =============== POST ===============

    .post('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN),
        validate(Validation.create),
        controller.createAdmin)

    .post('/signin',
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        validate(Validation.signIn),
        controller.signIn)

    .post('/forget-password',
        validate(Validation.forgetPassword),
        controller.forgetPassword)

    .post('/confirm-otp',
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        validate(Validation.confirmOTP),
        controller.confirmOTP)
    // =============== GET ===============

    .get('/signout',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        controller.signOut)

    .get('/newtoken/:id',
        controller.newToken)

    .get('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN),
        controller.getAll)

    .get('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, 'ID'),
        controller.getById)
    // =============== PATCH ===============

    .patch(`/${configFile.OTP.PASSWORD_URL}`,
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        validate(Validation.updatePassword),
        controller.updatePassword)

    .patch('/:id',
        requestLimiter(configFile.LIMITER.SECONDS, configFile.LIMITER.LIMIT),
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, 'ID'),
        validate(Validation.update),
        controller.update)
    // =============== DELETE ===============

    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN),
        controller.delete)


export default router