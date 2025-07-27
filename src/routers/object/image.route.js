import { Router } from "express";
import controller from '../../controllers/object/image.controller.js'

const router = Router()

router
    .post('/', controller.create)
    .get('/', controller.getAll)
    .get('/:id', controller.getByID)
    .patch('/:id', controller.update)
    .delete('/:id', controller.delete)

export default router