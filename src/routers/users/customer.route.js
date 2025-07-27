import { Router } from "express";
import controller from "../../controllers/user/customer.controller.js";
import config from '../../config/server.config.js'
const router = Router()

router
    .post('/', controller.createUser(config.SUPERADMIN.role, 'ADMIN'))
    .post('/signin', controller.signIn)
    .post('/token', controller.newToken)
    .post('/signout', controller.signOut)
    .get('/', controller.getAll)
    .get('/:id', controller.getByID)
    .patch('/password/:id', controller.updateUserPassword)
    .patch('/:id', controller.updateUser(config.SUPERADMIN.role, 'ADMIN'))
    .delete('/:id', controller.delete)

export default router