import { Router } from "express";
import controller from "../controllers/user/admin.controller.js";
const router = Router()

router
    .post('/', controller.createUser('SUPERADMIN'))
    .post('/signin', controller.signIn)
    .post('/token', controller.newToken)
    .post('/signout', controller.signOut)
    .get('/', controller.getAll)
    .get('/:id', controller.getByID)
    .patch('/:id', controller.getByID)
    .delete('/:id', controller.delete)

export default router