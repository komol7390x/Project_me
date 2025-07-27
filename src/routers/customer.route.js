import { Router } from "express";
import controller from "../controllers/user/customer.controller.js";
const router = Router()

router
    .post('/', controller.createUser('SUPERADMIN'))
    .post('/signin', controller.signIn)
// .post('signout', controller.signOut)
// .post('/token', controller.newToken)
// .get('/', controller.getAll)
// .get('/:id', controller.getByID)
// .patch('/:id', controller.getByID)
// .delete('/:id', controller.delete)

export default router