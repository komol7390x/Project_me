import { Router } from "express";
import constroller from '../../controller/api/order.controller.js'

import Validation from '../../validation/api/order.validate.js'

import { AuthGuard } from '../../guards/auth.guard.js'
import { RoleGuard } from '../../guards/role.guard.js'
import { Role } from "../../const/Role.js";
import { validate } from "../../middleware/validate.middle.js";

const router = Router()

router
    // =================== CREATE ===================
    .post('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.CUSTOMER),
        validate(Validation.create),
        constroller.createOrder)
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
        constroller.updateOrder)
    // =================== DELETE ===================
    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        constroller.delete)

export default router