import { Router } from "express";

import constroller from '../../controller/api/customer-wallet.controller.js'
import Validation from '../../validation/api/wallet.validate.js'

import { AuthGuard } from '../../guards/auth.guard.js'
import { RoleGuard } from '../../guards/role.guard.js'
import { Role } from "../../const/Role.js";
import { validate } from "../../middleware/validate.middle.js";

const router = Router()

router
    // =============== POST ===============
    .post('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.CUSTOMER),
        validate(Validation.createCustomer),
        constroller.createWallet)
    // =============== WALLET TO USER ===============
    .post('/pay-to-customer',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.SALLER),
        validate(Validation.cardCustomer),
        constroller.WalletToUser
    )
    .post('/send-from-customer',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.SALLER),
        validate(Validation.cardCustomer),
        constroller.userToWallet
    )
    // =============== GET ===============

    .get('/',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN),
        constroller.getAllWallet)

    // =============== GET BY ID ===============

    .get('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, Role.ADMIN, 'ID'),
        constroller.getById)
    // =============== PATCH ===============

    .patch('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, 'ID'),
        validate(Validation.updateCustomer),
        constroller.updateWallet)
    // =============== DELETE ===============
    .delete('/:id',
        AuthGuard,
        RoleGuard(Role.SUPERADMIN, 'ID'),
        constroller.delete)

export default router