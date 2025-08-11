import { Router } from "express";

import controller from '../../controller/clients/saller.controller.js'
import Validation from "../../validation/clients/saller.validate.js";

import { validate } from "../../middleware/validate.middle.js";
import { requestLimiter } from "../../utils/req-limiter.js";
import { configFile } from '../../config/server.config.js'
import { RoleGuard } from "../../guards/role.guard.js";
import { AuthGuard } from "../../guards/auth.guard.js";
import { Role } from "../../const/Role.js";

const router = Router()

router
    // =============== POST ===============

    .post('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        validate(Validation.create),
        controller.createSaller)

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
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, Role.SALLER),
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