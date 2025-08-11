import { Router } from "express";

import constroller from '../../controller/api/product.controller.js'
import Validation from '../../validation/api/product.validate.js'

import { Role } from "../../const/Role.js";
import { RoleGuard } from '../../guards/role.guard.js'
import { AuthGuard } from "../../guards/auth.guard.js";
import { validate } from "../../middleware/validate.middle.js";

const router = Router()

router

    .post('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, Role.SALLER),
        validate(Validation.create),
        constroller.createProduct)

    .get('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        constroller.getAll)

    .get('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, Role.SALLER, 'ID'),
        constroller.getById)

    .patch('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, Role.SALLER, 'ID'),
        validate(Validation.update),
        constroller.UpdateProduct)

    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, Role.SALLER, 'ID'),
        constroller.delete)

export default router