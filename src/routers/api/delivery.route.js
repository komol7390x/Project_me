import { Router } from "express";

import constroller from '../../controller/api/delivery.controller.js'
import Validation from '../../validation/api/delivery.validate.js'

import { AuthGuard } from '../../guards/auth.guard.js'
import { RoleGuard } from '../../guards/role.guard.js'
import { Role } from "../../const/Role.js";
import { validate } from "../../middleware/validate.middle.js";

const router = Router()

router
    // =============== POST ===============
    .post('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        validate(Validation.create),
        constroller.createDelivery)
    // =============== GET ===============
    .get('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        constroller.getAll)
    // =============== GET BY ID ===============
    .get('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        constroller.getById)
    // =============== UPDATE ===============
    .patch('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        validate(Validation.update),
        constroller.updateDelivery)
    // =============== DELETE ===============
    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        constroller.delete)

export default router