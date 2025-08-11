import { Router } from "express";
import constroller from '../../controller/api/payment.controller.js'

import Validation from '../../validation/api/payment.validate.js'

import { AuthGuard } from '../../guards/auth.guard.js'
import { RoleGuard } from '../../guards/role.guard.js'
import { Role } from "../../const/Role.js";
import { validate } from "../../middleware/validate.middle.js";
import { configFile } from "../../config/server.config.js";
const router = Router()

router
    // =================== CREATE ===================
    .post(`/${configFile.PAYMENT.CONFIRM_URL}`,
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.CUSTOMER),
        validate(Validation.create),
        constroller.createPayment)
    // =================== GET ALL ===================
    .get('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        constroller.getAll)
    // =================== GET BY ID ===================
    .get('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        constroller.getById)
    // =================== UPDATE ===================
    .patch('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        validate(Validation.update),
        constroller.update)
    // =================== DELETE ===================
    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        constroller.delete)

export default router